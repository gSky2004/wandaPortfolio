const db = require('../config/db');

const getDashboard = async (req, res, next) => {
  try {
    const [messages, unreadMessages, speaking, unreadSpeaking, testimonials, media, visitors] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS count FROM messages WHERE source IS DISTINCT FROM 'speaking'`),
      db.query(`SELECT COUNT(*)::int AS count FROM messages WHERE source IS DISTINCT FROM 'speaking' AND is_read = false`),
      db.query(`SELECT COUNT(*)::int AS count FROM messages WHERE source = 'speaking'`),
      db.query(`SELECT COUNT(*)::int AS count FROM messages WHERE source = 'speaking' AND is_read = false`),
      db.query('SELECT COUNT(*)::int AS count FROM testimonials'),
      db.query('SELECT COUNT(*)::int AS count FROM media_items'),
      db.query('SELECT COUNT(*)::int AS count FROM visitors'),
    ]);

    res.json({
      success: true,
      data: {
        totalMessages: messages.rows[0].count,
        unreadMessages: unreadMessages.rows[0].count,
        totalSpeaking: speaking.rows[0].count,
        unreadSpeaking: unreadSpeaking.rows[0].count,
        totalTestimonials: testimonials.rows[0].count,
        totalMedia: media.rows[0].count,
        totalVisitors: visitors.rows[0].count,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getExperiences = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM experiences ORDER BY display_order ASC, start_date DESC NULLS LAST'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getServices = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY display_order ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const result = await db.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach((r) => {
      settings[r.key] = r.value;
    });
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getExperiences, getServices, getSettings };
