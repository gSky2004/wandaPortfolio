const { body, validationResult } = require('express-validator');
const db = require('../config/db');

const testimonialValidation = [
  body('quote').trim().notEmpty().withMessage('Quote is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

const getAll = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM testimonials ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM testimonials WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: result.rows[0] });
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
    const { quote, name, role, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO testimonials (quote, name, role, display_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [quote, name, role || null, Number(display_order) || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await db.query('SELECT * FROM testimonials WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    const cur = existing.rows[0];
    const quote = req.body.quote ?? cur.quote;
    const name = req.body.name ?? cur.name;
    const role = req.body.role !== undefined ? req.body.role : cur.role;
    const display_order = req.body.display_order !== undefined ? Number(req.body.display_order) || 0 : cur.display_order;
    const result = await db.query(
      `UPDATE testimonials SET quote=$1, name=$2, role=$3, display_order=$4,
        updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *`,
      [quote, name, role, display_order, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, testimonialValidation };
