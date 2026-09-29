const express = require('express');
const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, ctrl.getDashboard);
router.get('/experiences', ctrl.getExperiences);
router.get('/services', ctrl.getServices);
router.get('/settings', ctrl.getSettings);

module.exports = router;
