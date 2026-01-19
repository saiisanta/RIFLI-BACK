// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  // Identificación
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  
  // Documentación (Argentina)
  documentType: {
    type: DataTypes.ENUM('DNI', 'CUIL', 'CUIT'),
    allowNull: false,
    defaultValue: 'DNI'
  },
  documentNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      // Validar formato DNI argentino (7-8 dígitos)
      is: /^[0-9]{7,8}$/
    }
  },
  
  // Contacto
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      // Formato argentino: +54 9 11 1234-5678
      is: /^\+?[0-9\s\-()]+$/
    }
  },
  
  // Avatar
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // Seguridad
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('CLIENT', 'TECHNICIAN', 'ADMIN'),
    allowNull: false,
    defaultValue: 'CLIENT'
  },
  
  // Estado
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Tokens
  verificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  verificationTokenExpires: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  
  // Tracking
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLoginIp: {
    type: DataTypes.STRING(45), // IPv6
    allowNull: true
  },
  
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Users',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['documentNumber'] },
    { fields: ['phone'] },
    { fields: ['role'] },
    { fields: ['isActive'] }
  ]
});

export default User;