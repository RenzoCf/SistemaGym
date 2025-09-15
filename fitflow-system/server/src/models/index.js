// src/models/index.js
const User = require('./User');
const MembershipType = require('./MembershipType');
const UserMembership = require('./UserMembership');

// Definir las relaciones entre modelos

// Relación User - UserMembership (Un usuario puede tener muchas membresías)
User.hasMany(UserMembership, {
  foreignKey: 'userId',
  as: 'memberships'
});

UserMembership.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Relación MembershipType - UserMembership (Un tipo puede estar en muchas membresías)
MembershipType.hasMany(UserMembership, {
  foreignKey: 'membershipTypeId',
  as: 'userMemberships'
});

UserMembership.belongsTo(MembershipType, {
  foreignKey: 'membershipTypeId',
  as: 'membershipType'
});

// Relación directa User - MembershipType a través de UserMembership
User.belongsToMany(MembershipType, {
  through: UserMembership,
  foreignKey: 'userId',
  otherKey: 'membershipTypeId',
  as: 'membershipTypes'
});

MembershipType.belongsToMany(User, {
  through: UserMembership,
  foreignKey: 'membershipTypeId',
  otherKey: 'userId',
  as: 'users'
});

// Método helper para obtener membresía activa de un usuario
User.prototype.getActiveMembership = async function() {
  const activeMembership = await UserMembership.findOne({
    where: {
      userId: this.id,
      status: 'active'
    },
    include: [{
      model: MembershipType,
      as: 'membershipType'
    }],
    order: [['endDate', 'DESC']]
  });
  
  return activeMembership;
};

// Método helper para verificar si un usuario tiene membresía activa
User.prototype.hasActiveMembership = async function() {
  const membership = await this.getActiveMembership();
  return membership && membership.isActive();
};

module.exports = {
  User,
  MembershipType,
  UserMembership
};