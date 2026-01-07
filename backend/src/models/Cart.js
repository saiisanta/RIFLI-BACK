import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define('Cart', {
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'Carts',
  // Local Table
  // tableName: 'carts',
  timestamps: true
});

export default Cart;