// models/Address.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notification = sequelize.define('Notification', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },

  // Tipo
  type: {
    type: DataTypes.ENUM(
      'ORDER_CREATED',
      'ORDER_PAID',
      'ORDER_SHIPPED',
      'ORDER_DELIVERED',
      'QUOTE_CREATED',
      'QUOTE_REPLIED',
      'QUOTE_ACCEPTED',
      'PAYMENT_APPROVED',
      'PAYMENT_REJECTED',
      'MESSAGE',
      'SYSTEM'
    ),
    allowNull: false
  },

  // Contenido
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT
  },

  // Metadata adicional
  //   1. Para una orden (ORDER_SHIPPED):
  // En lugar de solo decir "Tu pedido fue enviado" guarda el ID para que al hacer click el usuario vaya directo a esa orden

  // JSON
  // {
  //   "orderId": 450,
  //   "trackingNumber": "AR123456789",
  //   "carrier": "Correo Argentino"
  // }
  // 2. Para un mensaje o consulta (QUOTE_REPLIED):
  // JSON
  // {
  //   "quoteId": 12,
  //   "adminId": 5,
  //   "link": "/dashboard/quotes/12"
  // }
  // 3. Para una promoción o sistema (SYSTEM):
  // JSON
  // {
  //   "discountCode": "VERANO2026",
  //   "expiresAt": "2026-02-01"
  // }
  metadata: {
    type: DataTypes.JSON
  },

  // Estado
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE
  },

  // Envío por email
  // sentViaEmail: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false
  // },
  // emailSentAt: {
  //   type: DataTypes.DATE
  // }
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['is_read'] },
    { fields: ['created_at'] }
  ]
});

export default Notification;