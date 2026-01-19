import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Address = sequelize.define('Address', {
  userId: {
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
  postalCode: {
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
  placeId: { // Google Place ID
    type: DataTypes.STRING(255),
    allowNull: true
  },
  formattedAddress: { // Dirección formateada por Google
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // Referencias adicionales
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Timbre, piso, entre calles, etc.'
  },
  
  // Flags
  isDefault: { // Dirección elegida por el usuario
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Addresses',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['isDefault'] },
    { fields: ['postalCode'] }
  ]
});

export default Address;