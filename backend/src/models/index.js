// models/index.js
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
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.hasMany(Order, { foreignKey: 'address_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Quote, { foreignKey: 'client_id', as: 'quotes' });
Quote.belongsTo(User, { foreignKey: 'client_id', as: 'client' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// ============ PRODUCT RELATIONS ============
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subcategories',onDelete: 'CASCADE' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// ============ SERVICE & QUOTE RELATIONS ============
Service.hasMany(Quote, { foreignKey: 'service_id', as: 'quotes' });
Quote.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

Address.hasMany(Quote, { foreignKey: 'address_id', as: 'quotes' });
Quote.belongsTo(Address, { foreignKey: 'address_id', as: 'workAddress' });

// ============ ORDER RELATIONS ============
Order.belongsTo(Address, { foreignKey: 'address_id', as: 'shippingAddress' });
Address.hasMany(Order, { foreignKey: 'address_id' });

// ============ PAYMENT PROOF RELATIONS ============
PaymentProof.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PaymentProof.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });
User.hasMany(PaymentProof, { foreignKey: 'user_id', as: 'paymentProofs' });
User.hasMany(PaymentProof, { foreignKey: 'reviewed_by', as: 'reviewedProofs' });

// ============ CART RELATIONS ============
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// ============ BANK ACCOUNT RELATIONS ============
// Una cuenta bancaria puede recibir muchos comprobantes
BankAccount.hasMany(PaymentProof, { foreignKey: 'bank_account_id', as: 'receivedPayments' });
PaymentProof.belongsTo(BankAccount, { foreignKey: 'bank_account_id', as: 'destinationAccount' });

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