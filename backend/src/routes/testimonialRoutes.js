const express = require('express');
const ctrl = require('../controllers/testimonialController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, ctrl.testimonialValidation, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
