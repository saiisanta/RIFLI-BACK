const sequelize = require('../config/db');

const User = require('./User');
const Product = require('./Product');
const Service = require('./Service');
const Quote = require('./Quote');
const Cart = require('./Cart');

// Relaciones
User.hasMany(Quote);
Quote.belongsTo(User);

Service.hasMany(Quote);
Quote.belongsTo(Service);

User.hasMany(Cart);
Cart.belongsTo(User);

Product.hasMany(Cart);
Cart.belongsTo(Product);

module.exports = { 
  sequelize, 
  User, 
  Product, 
  Service, 
  Quote, 
  Cart 
};