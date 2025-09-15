// src/models/UserMembership.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserMembership = sequelize.define('UserMembership', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  membershipTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'membership_types',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'suspended'),
    defaultValue: 'active'
  }
}, {
  tableName: 'user_memberships',
  timestamps: true
});

// Método para verificar si la membresía está activa
UserMembership.prototype.isActive = function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  return this.status === 'active' && endDate >= today;
};

// Método para verificar si está próxima a vencer (7 días)
UserMembership.prototype.isExpiringSoon = function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
};

// Método para obtener días restantes
UserMembership.prototype.getDaysRemaining = function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
};

// Método para obtener estado con descripción
UserMembership.prototype.getStatusDescription = function() {
  if (this.status !== 'active') {
    return this.status === 'expired' ? 'Vencida' : 'Suspendida';
  }
  
  const daysRemaining = this.getDaysRemaining();
  if (daysRemaining < 0) return 'Vencida';
  if (daysRemaining <= 7) return 'Por vencer';
  return 'Vigente';
};

module.exports = UserMembership;