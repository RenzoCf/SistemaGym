// src/middleware/validation.js
const { body } = require('express-validator');

// Validaciones para registro de usuario
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
    
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
    
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
    
  body('phone')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('Debe proporcionar un número de teléfono válido para Perú')
];

// Validaciones para login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
    
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// Validaciones para actualizar perfil
const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
    
  body('phone')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('Debe proporcionar un número de teléfono válido para Perú'),
    
  body('dateOfBirth')
    .optional()
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),
    
  body('gender')
    .optional()
    .isIn(['masculino', 'femenino', 'otro', 'prefiero-no-decir'])
    .withMessage('Género debe ser: masculino, femenino, otro o prefiero-no-decir'),
    
  body('emergencyContactName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del contacto de emergencia debe tener entre 2 y 100 caracteres'),
    
  body('emergencyContactPhone')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('El teléfono del contacto de emergencia debe ser válido')
];

// Validaciones para cambio de contraseña
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
    
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
};