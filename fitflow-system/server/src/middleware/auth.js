// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para proteger rutas - requiere autenticación
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extraer el token del header "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si no hay token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. No se proporcionó token de autenticación'
      });
    }

    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Obtener el usuario del token
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido. Usuario no encontrado'
        });
      }

      // Verificar si el usuario está activo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada'
        });
      }

      // Agregar usuario al objeto request
      req.user = user;
      next();

    } catch (tokenError) {
      console.error('Error de token:', tokenError.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

  } catch (error) {
    console.error('Error en middleware protect:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor en autenticación'
    });
  }
};

// Middleware para autorizar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar si el usuario tiene alguno de los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol '${req.user.role}' no tiene permisos para acceder a este recurso. Roles permitidos: ${roles.join(', ')}`
      });
    }
    next();
  };
};

// Middleware para verificar si el usuario es el propietario del recurso o admin
const authorizeOwnerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    // Los admins pueden acceder a cualquier recurso
    if (req.user.role === 'admin') {
      return next();
    }
    
    // El usuario solo puede acceder a sus propios recursos
    if (req.user.id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    next();
  };
};

// Middleware para verificar membresía activa
const requireActiveMembership = async (req, res, next) => {
  try {
    const hasActiveMembership = await req.user.hasActiveMembership();
    
    if (!hasActiveMembership) {
      return res.status(403).json({
        success: false,
        message: 'Se requiere una membresía activa para acceder a este recurso'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error verificando membresía:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al verificar membresía'
    });
  }
};

module.exports = {
  protect,
  authorize,
  authorizeOwnerOrAdmin,
  requireActiveMembership
};