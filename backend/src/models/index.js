import sequelize from '../config/db.js';
import User from './User.js';
import Address from './Address.js';
import Category from './Category.js';
import Brand from './Brand.js';
import Product from './Product.js';
import Service from './Service.js';
import Quote from './Quote.js';
import Cart from './Cart.js';
import Order from './Order.js';
import Notification from './Notification.js';
import PaymentProof from './PaymentProof.js';
import BankAccount from './BankAccount.js';

// ============ USER RELATIONS ============
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.hasMany(Order, { foreignKey: 'addressId' });
Address.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Quote, { foreignKey: 'clientId', as: 'quotes' });
Quote.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// ============ PRODUCT RELATIONS ============
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories',onDelete: 'CASCADE' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// ============ SERVICE & QUOTE RELATIONS ============
Service.hasMany(Quote, { foreignKey: 'serviceId', as: 'quotes' });
Quote.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

Address.hasMany(Quote, { foreignKey: 'addressId', as: 'quotes' });
Quote.belongsTo(Address, { foreignKey: 'addressId', as: 'workAddress' });

// ============ ORDER RELATIONS ============
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'shippingAddress' });
Address.hasMany(Order, { foreignKey: 'addressId' });

// ============ PAYMENT PROOF RELATIONS ============
PaymentProof.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PaymentProof.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });
User.hasMany(PaymentProof, { foreignKey: 'userId', as: 'paymentProofs' });
User.hasMany(PaymentProof, { foreignKey: 'reviewedBy', as: 'reviewedProofs' });

// ============ CART RELATIONS ============
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// ============ BANK ACCOUNT RELATIONS ============
// Una cuenta bancaria puede recibir muchos comprobantes
BankAccount.hasMany(PaymentProof, { foreignKey: 'bankAccountId', as: 'receivedPayments' });
PaymentProof.belongsTo(BankAccount, { foreignKey: 'bankAccountId', as: 'destinationAccount' });

export {
  sequelize,
  User,
  Address,
  Category,
  Brand,
  Product,
  Service,
  Quote,
  Cart,
  Order,
  Notification,
  PaymentProof,
  BankAccount
};