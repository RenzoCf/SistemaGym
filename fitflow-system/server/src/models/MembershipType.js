// src/models/MembershipType.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MembershipType = sequelize.define('MembershipType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  durationDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  benefits: {
    type: DataTypes.JSON, // Array de beneficios
    defaultValue: []
  },
  maxClasses: {
    type: DataTypes.INTEGER,
    defaultValue: -1, // -1 significa ilimitado
    validate: {
      min: -1
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'membership_types',
  timestamps: true
});

// Método para verificar si tiene clases ilimitadas
MembershipType.prototype.hasUnlimitedClasses = function() {
  return this.maxClasses === -1;
};

// Método para obtener precio formateado
MembershipType.prototype.getFormattedPrice = function() {
  return `S/ ${parseFloat(this.price).toFixed(2)}`;
};

module.exports = MembershipType;