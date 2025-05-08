const sequelize = require('../config/db');

// Importamos modelos
const User = require('./User');
const Product = require('./Product');
const Service = require('./Service');
const Quote = require('./Quote');
const Cart = require('./Cart');

// Relaciones

// Un usuario puede tener muchos presupuestos
User.hasMany(Quote, { foreignKey: 'userId' });
Quote.belongsTo(User, { foreignKey: 'userId' });

// Un servicio puede tener muchos presupuestos
Service.hasMany(Quote, { foreignKey: 'serviceId' });
Quote.belongsTo(Service, { foreignKey: 'serviceId' });

// Un usuario puede tener muchos productos en el carrito
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Un producto puede estar en muchos carritos
Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  Service,
  Quote,
  Cart
};
