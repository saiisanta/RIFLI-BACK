import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Address = sequelize.define('Address', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },

  // Datos básicos
  alias: {
    type: DataTypes.STRING(50), // "Casa", "Trabajo", "Oficina"
    allowNull: false
  },

  // Dirección completa
  street: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  number: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  floor: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  apartment: {
    type: DataTypes.STRING(10),
    allowNull: true
  },

  // Localización
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(50),
    defaultValue: 'Argentina'
  },

  // Google Maps API
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  place_id: { // Google Place ID
    type: DataTypes.STRING(255),
    allowNull: true
  },
  formatted_address: { // Dirección formateada por Google
    type: DataTypes.STRING(500),
    allowNull: true
  },

  // Referencias adicionales
  additional_info: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Timbre, piso, entre calles, etc.'
  },

  // Flags
  is_default: { // Dirección elegida por el usuario
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'addresses',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['is_default'] },
    { fields: ['postal_code'] }
  ]
});

export default Address;