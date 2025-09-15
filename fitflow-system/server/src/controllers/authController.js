// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

// Función para generar JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone: phone || null
    });

    // Generar token
    const token = generateToken(user.id);

    // Respuesta exitosa (sin incluir la contraseña)
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor durante el registro'
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'La cuenta ha sido desactivada'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id);

    // Obtener membresía activa
    const activeMembership = await user.getActiveMembership();

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        ...user.toSafeObject(),
        activeMembership: activeMembership ? {
          id: activeMembership.id,
          membershipType: activeMembership.membershipType,
          startDate: activeMembership.startDate,
          endDate: activeMembership.endDate,
          status: activeMembership.status,
          daysRemaining: activeMembership.getDaysRemaining(),
          statusDescription: activeMembership.getStatusDescription()
        } : null
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor durante el login'
    });
  }
};

// @desc    Obtener datos del usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener membresía activa
    const activeMembership = await user.getActiveMembership();

    res.json({
      success: true,
      user: {
        ...user.toSafeObject(),
        activeMembership: activeMembership ? {
          id: activeMembership.id,
          membershipType: activeMembership.membershipType,
          startDate: activeMembership.startDate,
          endDate: activeMembership.endDate,
          status: activeMembership.status,
          daysRemaining: activeMembership.getDaysRemaining(),
          statusDescription: activeMembership.getStatusDescription()
        } : null
      }
    });

  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener datos del usuario'
    });
  }
};

// @desc    Logout (invalidar token del lado del cliente)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // En JWT stateless, el logout se maneja del lado del cliente eliminando el token
    // Aquí podríamos agregar lógica adicional como blacklist de tokens si fuera necesario
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor durante el logout'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  generateToken
};