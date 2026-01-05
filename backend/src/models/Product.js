import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
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
}, {
  tableName: 'products',
  timestamps: true
});

export default Product;