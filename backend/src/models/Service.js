// models/Service.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('Service', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  // slug: {
  //   type: DataTypes.STRING(255),
  //   unique: true
  // },

  // Tipo de servicio
  type: {
    type: DataTypes.ENUM('ELECTRICITY', 'SECURITY', 'GAS'),
    allowNull: false
  },

  // Descripción
  short_description: {
    type: DataTypes.STRING(500)
  },
  long_description: {
    type: DataTypes.TEXT
  },

  // Visual
  icon: {
    type: DataTypes.STRING(50), // Nombre del icono
    comment: 'Ejemplo: "zap", "shield", "flame"'
  },
  image_url: {
    type: DataTypes.STRING(500)
  },

  // Características (bullets)
  features: {
    type: DataTypes.JSON,
    comment: 'Array de strings: ["Feature 1", "Feature 2"]'
  },
  /* Ejemplo:
  [
    "Certificación TE1 incluida",
    "Garantía de 12 meses",
    "Asesoramiento técnico"
  ]
  */

  // Precio base (opcional, puede variar según presupuesto)
  // basePrice: {
  //   type: DataTypes.DECIMAL(10, 2),
  //   allowNull: true
  // },

  // Estado
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  // Orden de visualización
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'services',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['is_active'] },
    // { fields: ['slug'] }
  ]
});

export default Service;