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
  logoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Brands',
  timestamps: true
});

export default Brand;