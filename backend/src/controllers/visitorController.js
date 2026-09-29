const crypto = require('crypto');
const db = require('../config/db');

const BOT_PATTERN = /bot|crawl|spider|slurp|mediapartners|baidu|yandex|semrush|ahrefs|screaming|mj12|dotbot|petal|aspiegel|huawei.*?(bot|crawl)|bytespider|gptbot|claudebot|ccbot|omgili|serpstat|dataforseo|flipboard|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|pinterest|slackbot|telegrambot|discordbot|whatsapp|skype|python|curl|wget|libwww|go-http|node|powershell|postman|insomnia|httpclient|java|okhttp|axios|ruby|perl|php/i;

const parseUA = (ua = '') => {
  if (BOT_PATTERN.test(ua)) {
    let os = 'Unknown';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os/i.test(ua)) os = 'macOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/linux/i.test(ua)) os = 'Linux';
    return { browser: 'Bot', os, device: 'Bot' };
  }

  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';
  else if (/msie|trident/i.test(ua)) browser = 'IE';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  if (/mobile|android|iphone|ipod/i.test(ua)) device = 'Mobile';
  else if (/ipad|tablet/i.test(ua)) device = 'Tablet';

  return { browser, os, device };
};

const track = async (req, res, next) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const { browser, os, device } = parseUA(ua);
    const page = req.body.page || req.headers.referer || '/';
    const referrer = req.body.referrer || '';
    const sessionId = req.body.session_id || null;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(ip + (process.env.JWT_SECRET || 'salt')).digest('hex').slice(0, 16);

    const INSERT_SQL = `INSERT INTO visitors
        (visit_date, visit_time, browser, operating_system, device_type, page_visited, referrer, ip_hash, session_id)
       VALUES (CURRENT_DATE, CURRENT_TIME, $1, $2, $3, $4, $5, $6, $7)
       RETURNING id`;
    const params = [browser, os, device, page, referrer, ipHash, sessionId];

    if (!sessionId) {
      const result = await db.query(INSERT_SQL, params);
      return res.status(201).json({ success: true, id: result.rows[0].id });
    }

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`${sessionId}:${page}`]);

      const { rows } = await client.query(
        `SELECT 1 FROM visitors
          WHERE session_id = $1 AND page_visited = $2
            AND created_at > NOW() - INTERVAL '2 seconds'
          LIMIT 1`,
        [sessionId, page]
      );

      if (rows.length) {
        await client.query('COMMIT');
        return res.status(201).json({ success: true, duplicate: true });
      }

      const result = await client.query(INSERT_SQL, params);
      await client.query('COMMIT');
      return res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const HUMAN = `browser IS DISTINCT FROM 'Bot'`;
    const [total, today, weekly, monthly, bots, byBrowser, byOS, byDevice, byPage, dailyTrend, recent] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS count FROM visitors WHERE ${HUMAN}`),
      db.query(`SELECT COUNT(*)::int AS count FROM visitors WHERE ${HUMAN} AND visit_date = CURRENT_DATE`),
      db.query(`SELECT COUNT(*)::int AS count FROM visitors WHERE ${HUMAN} AND visit_date >= CURRENT_DATE - INTERVAL '7 days'`),
      db.query(`SELECT COUNT(*)::int AS count FROM visitors WHERE ${HUMAN} AND visit_date >= CURRENT_DATE - INTERVAL '30 days'`),
      db.query(`SELECT COUNT(*)::int AS count FROM visitors WHERE browser = 'Bot'`),
      db.query(`SELECT browser, COUNT(*)::int AS count FROM visitors WHERE ${HUMAN} GROUP BY browser ORDER BY count DESC`),
      db.query(`SELECT operating_system AS name, COUNT(*)::int AS count FROM visitors WHERE ${HUMAN} GROUP BY operating_system ORDER BY count DESC`),
      db.query(`SELECT device_type AS name, COUNT(*)::int AS count FROM visitors WHERE ${HUMAN} GROUP BY device_type ORDER BY count DESC`),
      db.query(`
        SELECT page_visited AS name, COUNT(*)::int AS count
        FROM visitors
        WHERE ${HUMAN}
        GROUP BY page_visited
        ORDER BY count DESC
        LIMIT 10
      `),
      db.query(`
        SELECT visit_date::text AS date, COUNT(*)::int AS count
        FROM visitors
        WHERE ${HUMAN} AND visit_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY visit_date
        ORDER BY visit_date ASC
      `),
      db.query(`SELECT * FROM visitors WHERE ${HUMAN} ORDER BY created_at DESC LIMIT 50`),
    ]);

    res.json({
      success: true,
      data: {
        total: total.rows[0].count,
        today: today.rows[0].count,
        weekly: weekly.rows[0].count,
        monthly: monthly.rows[0].count,
        bots: bots.rows[0].count,
        browsers: byBrowser.rows,
        operatingSystems: byOS.rows,
        devices: byDevice.rows,
        pages: byPage.rows,
        dailyTrend: dailyTrend.rows,
        recent: recent.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { track, getStats };
