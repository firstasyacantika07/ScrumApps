const express = require('express');
const router = express.Router();
// Pastikan file authController.js sudah ada di folder controllers
const authController = require('../controllers/authController');

// Route untuk autentikasi
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;