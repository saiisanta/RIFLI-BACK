// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  // Identificación
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },

  // Documentación (Argentina)
  document_type: {
    type: DataTypes.ENUM('DNI', 'CUIL', 'CUIT'),
    allowNull: true,
    defaultValue: 'DNI'
  },
  document_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
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
  avatar_url: {
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
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // Tokens
  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  verification_token_expires: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  // Tracking
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login_ip: {
    type: DataTypes.STRING(45), // IPv6
    allowNull: true
  },

  // Soft delete
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['document_number'] },
    { fields: ['phone'] },
    { fields: ['role'] },
    { fields: ['is_active'] }
  ]
});

export default User;