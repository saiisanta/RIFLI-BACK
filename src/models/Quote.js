// src/models/Quote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quote = sequelize.define('Quote', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
  details: { type: DataTypes.TEXT }, // descripción del pedido del cliente
  status: {
    type: DataTypes.ENUM('pendiente', 'enviado', 'aceptado', 'rechazado'),
    defaultValue: 'pendiente'
  }
}, {
  timestamps: true
});

module.exports = Quote;
