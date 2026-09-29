const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { notifyNewMessage } = require('../services/notify');

const messageValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('source').optional().isIn(['contact', 'speaking']).withMessage('Invalid source'),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage('Invalid phone number'),
];

const getAll = async (req, res, next) => {
  try {
    const { search, unread, source } = req.query;
    let query = 'SELECT * FROM messages WHERE 1=1';
    const params = [];
    let i = 1;

    if (search) {
      query += ` AND (name ILIKE $${i} OR email ILIKE $${i} OR subject ILIKE $${i} OR message ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }
    if (source === 'contact' || source === 'speaking') {
      query += ` AND source = $${i}`;
      params.push(source);
      i++;
    }
    if (unread === 'true') {
      query += ' AND is_read = false';
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, subject, message } = req.body;
    const source = req.body.source === 'speaking' ? 'speaking' : 'contact';
    const phone = typeof req.body.phone === 'string' && req.body.phone.trim() ? req.body.phone.trim() : null;
    const result = await db.query(
      `INSERT INTO messages (name, email, subject, message, source, phone) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, email.toLowerCase(), subject || null, message, source, phone]
    );
    notifyNewMessage({ source, name, email: email.toLowerCase(), phone, subject: subject || null, message }).catch(
      (err) => console.error(`[notify] background alert failed: ${err.message}`)
    );
    res.status(201).json({ success: true, message: 'Message sent successfully', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE messages SET is_read = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, markRead, remove, messageValidation };
