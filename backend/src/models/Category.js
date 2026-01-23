// models/Category.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  // slug: {
  //   type: DataTypes.STRING(100),
  //   unique: true
  // },
  description: {
    type: DataTypes.TEXT
  },
  parent_id: { // Categorías anidadas (relacionar subcategorias)
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'categories', key: 'id' }
  },
  icon: {
    type: DataTypes.STRING(50), // Nombre del icono
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // order: { // Orden de visualización
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0
  // }
}, {
  tableName: 'categories',
  timestamps: true,
  indexes: [
    {
      fields: ['parent_id'] 
    }
  ]
});

export default Category;