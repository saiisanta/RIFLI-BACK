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
  parentId: { // Categorías anidadas (relacionar subcategorias)
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'categories', key: 'id' }
  },
  icon: {
    type: DataTypes.STRING(50), // Nombre del icono
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // order: { // Orden de visualización
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0
  // }
}, {
  tableName: 'Categories',
  timestamps: true,
  indexes: [
    {
      fields: ['parentId'] 
    }
  ]
});

export default Category;