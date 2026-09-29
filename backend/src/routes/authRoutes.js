const express = require('express');
const { login, me, loginValidation } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginValidation, login);
router.get('/me', auth, me);

module.exports = router;
