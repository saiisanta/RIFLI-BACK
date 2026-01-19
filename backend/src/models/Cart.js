import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define('Cart', {
  user_id: {
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
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  // Auto-cleanup
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de expiración del carrito'
  }
}, {
  tableName: 'carts',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['expires_at'] }
  ]
});

export default Cart;