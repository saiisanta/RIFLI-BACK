const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define('Cart', {
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1,
    allowNull: false
  }
});

module.exports = Cart;