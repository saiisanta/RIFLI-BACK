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
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  longDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Categorización
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: 'categories', key: 'id' }
  },
  brandId: {
    type: DataTypes.INTEGER,
    references: { model: 'brands', key: 'id' }
  },
  
  // Precio
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  costPrice: { // Precio de costo (solo admin)
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  
  // Stock
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  minStock: { // Alerta de stock bajo
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
  mainImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // SEO
  metaTitle: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  
  // Estado
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // isFeatured: { // Producto destacado
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false
  // },
  
  // Stats
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  salesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Products',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['sku'] },
    { fields: ['categoryId'] },
    { fields: ['brandId'] },
    { fields: ['isActive'] },
    { fields: ['price'] },
    { fields: ['name'] }
  ]
});

export default Product;