const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // puede ser null si no subieron una imagen
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  categoria: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
});

module.exports = Product;
