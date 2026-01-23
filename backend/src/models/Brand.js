// models/Brand.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Brand = sequelize.define('Brand', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  // slug: {
  //   type: DataTypes.STRING(100),
  //   unique: true
  // },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'brands',
  timestamps: true
});

export default Brand;