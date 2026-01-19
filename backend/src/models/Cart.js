import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  
  // Items del carrito (JSON)
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  /* Ejemplo:
  [
    {
      "productId": 1,
      "name": "Cámara Hikvision",
      "quantity": 2,
      "price": 79.99, // Precio al momento de agregar
      "imageUrl": "/images/cam1.jpg"
    }
  ]
  */
  
  // Totales (calculados)
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  
  // Estado
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // Auto-cleanup
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de expiración del carrito'
  }
}, {
  tableName: 'Carts',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['expiresAt'] }
  ]
});

export default Cart;