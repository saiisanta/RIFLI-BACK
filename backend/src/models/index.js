import sequelize from '../config/db.js';

import User from './User.js';
import Product from './Product.js';
import Service from './Service.js';
import Quote from './Quote.js';
import Cart from './Cart.js';

// Relaciones
User.hasMany(Quote, { foreignKey: 'userId' });
Quote.belongsTo(User, { foreignKey: 'userId' });

Service.hasMany(Quote, { foreignKey: 'serviceId' });
Quote.belongsTo(Service, { foreignKey: 'serviceId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

export { 
  sequelize, 
  User, 
  Product, 
  Service, 
  Quote, 
  Cart 
};