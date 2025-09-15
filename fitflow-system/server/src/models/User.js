// src/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('cliente', 'entrenador', 'recepcionista', 'admin'),
    defaultValue: 'cliente',
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [9, 20]
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY
  },
  gender: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro', 'prefiero-no-decir')
  },
  profileImage: {
    type: DataTypes.TEXT // URL de la imagen
  },
  emergencyContactName: {
    type: DataTypes.STRING
  },
  emergencyContactPhone: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpire: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  hooks: {
    // Hook para hashear la contraseña antes de crear el usuario
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hook para hashear la contraseña antes de actualizar (si cambió)
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia para verificar contraseña
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual para nombre completo
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Método para obtener usuario sin contraseña
User.prototype.toSafeObject = function() {
  const { password, resetPasswordToken, resetPasswordExpire, ...safeUser } = this.toJSON();
  return safeUser;
};

module.exports = User;