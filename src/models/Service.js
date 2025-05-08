// src/models/Service.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: {
    type: DataTypes.ENUM(
      'electricidad',
      'seguridad',
      'trabajos_en_seco',
      'gasista',
      'distribucion'
    ),
    allowNull: false
  },
  imageUrl: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = Service;
