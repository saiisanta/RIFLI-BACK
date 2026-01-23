// models/Product.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
  // Básico
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  // slug: {
  //   type: DataTypes.STRING(255),
  //   unique: true,
  //   allowNull: false
  // },
  sku: { // Código único del producto
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true
  },

  // Descripción
  short_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  long_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Categorización
  category_id: {
    type: DataTypes.INTEGER,
    references: { model: 'categories', key: 'id' }
  },
  brand_id: {
    type: DataTypes.INTEGER,
    references: { model: 'brands', key: 'id' }
  },

  // Precio
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cost_price: { // Precio de costo (solo admin)
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },

  // Stock
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  min_stock: { // Alerta de stock bajo
    type: DataTypes.INTEGER,
    defaultValue: 5
  },

  // Características
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Estructura: [{ group: "Características principales", attrs: [{ key: "Marca", value: "Hikvision" }] }]'
  },

  /* Ejemplo de estructura:
  [
    {
      "group": "Características principales",
      "attributes": [
        { "key": "Marca", "value": "Hikvision" },
        { "key": "Modelo", "value": "DS-2CD2043G0-I" },
        { "key": "Resolución", "value": "4MP" }
      ]
    },
    {
      "group": "Conectividad",
      "attributes": [
        { "key": "Tipo", "value": "IP" },
        { "key": "WiFi", "value": "No" }
      ]
    }
  ]
  */

  // Imágenes (múltiples)
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de URLs: ["/images/product1.jpg", "/images/product2.jpg"]'
  },
  main_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  // SEO
  meta_title: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(160),
    allowNull: true
  },

  // Estado
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // isFeatured: { // Producto destacado
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false
  // },

  // Stats
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sales_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['sku'] },
    { fields: ['category_id'] },
    { fields: ['brand_id'] },
    { fields: ['is_active'] },
    { fields: ['price'] },
    { fields: ['name'] }
  ]
});

export default Product;