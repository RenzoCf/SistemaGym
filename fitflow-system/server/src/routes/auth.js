// src/routes/auth.js
const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login de usuario
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Obtener datos del usuario actual
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout de usuario
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;