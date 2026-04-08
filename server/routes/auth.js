const express = require('express');
const router = express.Router();

const authController  = require('../controllers/authController');

// Register Route
router.post('/register', authController.register);
// login Routes
router.post('/login', authController.login);
// logout Route
router.post('/logout', authController.logout);

router.get('/me', authController.me);

module.exports = router;