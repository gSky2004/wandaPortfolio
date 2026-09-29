const express = require('express');
const ctrl = require('../controllers/visitorController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/track', ctrl.track);
router.get('/stats', auth, ctrl.getStats);

module.exports = router;
