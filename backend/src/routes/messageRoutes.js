const express = require('express');
const ctrl = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', ctrl.messageValidation, ctrl.create);
router.get('/', auth, ctrl.getAll);
router.patch('/:id/read', auth, ctrl.markRead);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
