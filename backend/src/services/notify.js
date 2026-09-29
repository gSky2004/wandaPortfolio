const nodemailer = require('nodemailer');

const EMAIL_TIMEOUT_MS = 10000;
const WA_TIMEOUT_MS = 10000;

const smtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const waConfigured = () =>
  process.env.WHATSAPP_PROVIDER === 'callmebot' &&
  Boolean(process.env.CALLMEBOT_API_KEY && process.env.WHATSAPP_TO);

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS,
  });
  return transporter;
};

const sendEmailNotification = async ({ to, subject, text, replyTo }) => {
  if (!smtpConfigured()) {
    console.log('[notify] SMTP not configured, skipping email alert');
    return false;
  }
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  });
  console.log(`[notify] email alert sent to ${to}`);
  return true;
};

const CALLMEBOT_ERROR_MARKERS = ['api no auth', 'error:'];

const sendWhatsAppNotification = async ({ to, text }) => {
  if (!waConfigured()) {
    console.log('[notify] WhatsApp not configured, skipping WhatsApp alert');
    return false;
  }
  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(to)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(process.env.CALLMEBOT_API_KEY)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), WA_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const body = await res.text();
    if (!res.ok || CALLMEBOT_ERROR_MARKERS.some((m) => body.toLowerCase().includes(m))) {
      console.error(`[notify] CallMeBot failed: ${body.slice(0, 200)}`);
      return false;
    }
    console.log(`[notify] WhatsApp alert sent to ${to}`);
    return true;
  } catch (err) {
    console.error(`[notify] WhatsApp error: ${err.message}`);
    return false;
  } finally {
    clearTimeout(timer);
  }
};

const buildAlert = ({ source, name, email, phone, subject, message }) => {
  const kind = source === 'speaking' ? 'speaking invite' : 'message';
  return {
    emailSubject: `[Wanda Site] New ${kind} from ${name}`,
    emailText: [
      `New ${kind} received on the Wanda Gordon site.`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `WhatsApp: ${phone || '—'}`,
      `Type: ${source === 'speaking' ? 'Speaking invite' : 'Contact message'}`,
      subject ? `Subject: ${subject}` : null,
      '',
      'Message:',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n'),
    waText: `Wanda Site: new ${kind} from ${name} (${email}${phone ? `, WA ${phone}` : ''}). ${String(message).slice(0, 200)}`,
  };
};

const notifyNewMessage = async (payload) => {
  try {
    const { emailSubject, emailText, waText } = buildAlert(payload);
    const emailTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
    const results = await Promise.allSettled([
      emailTo
        ? sendEmailNotification({ to: emailTo, subject: emailSubject, text: emailText, replyTo: payload.email })
        : false,
      sendWhatsAppNotification({ to: process.env.WHATSAPP_TO, text: waText }),
    ]);
    const outcomes = results.map((r) => {
      if (r.status === 'fulfilled') return r.value;
      console.error(`[notify] channel failed: ${r.reason?.message || r.reason}`);
      return false;
    });
    return outcomes;
  } catch (err) {
    console.error(`[notify] failed: ${err.message}`);
    return [false, false];
  }
};

module.exports = { notifyNewMessage, sendEmailNotification, sendWhatsAppNotification };
