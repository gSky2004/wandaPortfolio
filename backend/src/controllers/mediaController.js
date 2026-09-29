const { body, validationResult } = require('express-validator');
const db = require('../config/db');

const mediaValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('youtube_id').trim().notEmpty().withMessage('YouTube video ID is required'),
];

const extractYoutubeId = (input = '') => {
  const s = String(input).trim();
  const urlMatch = s.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (urlMatch) return urlMatch[1];
  const rawMatch = s.match(/^([A-Za-z0-9_-]{11})$/);
  return rawMatch ? rawMatch[1] : s;
};

const getAll = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM media_items ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM media_items WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
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
    const { title, youtube_id, description, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO media_items (title, youtube_id, description, display_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, extractYoutubeId(youtube_id), description || null, Number(display_order) || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await db.query('SELECT * FROM media_items WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }
    const cur = existing.rows[0];
    const title = req.body.title ?? cur.title;
    const youtube_id = req.body.youtube_id !== undefined ? extractYoutubeId(req.body.youtube_id) : cur.youtube_id;
    const description = req.body.description !== undefined ? req.body.description : cur.description;
    const display_order = req.body.display_order !== undefined ? Number(req.body.display_order) || 0 : cur.display_order;
    const result = await db.query(
      `UPDATE media_items SET title=$1, youtube_id=$2, description=$3, display_order=$4,
        updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *`,
      [title, youtube_id, description, display_order, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM media_items WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }
    res.json({ success: true, message: 'Media item deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, mediaValidation };
