import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  // Identificación
  orderNumber: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    comment: 'Formato: ORD-2026-00001'
  },
  
  // Referencias
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  addressId: {
    type: DataTypes.INTEGER,
    references: { model: 'addresses', key: 'id' }
  },
  
  // Items (snapshot del carrito)
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  /* Mismo formato que Cart.items */
  
  // Totales
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'ARS'
  },
  
  // Estado de la orden
  status: {
    type: DataTypes.ENUM(
      'PENDING_PAYMENT',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED'
    ),
    defaultValue: 'PENDING_PAYMENT'
  },
  
  // Pago (Mercado Pago)
  paymentMethod: {
    type: DataTypes.ENUM('BANK_TRANSFER', 'CASH'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM(
      'PENDING_PROOF',      // Esperando comprobante
      'PROOF_UPLOADED',     // Comprobante subido
      'APPROVED',           // Pago aprobado
      'REJECTED',           // Comprobante rechazado
      'PAID'                // Pagado (cash confirmado)
    ),
    defaultValue: 'PENDING_PROOF'
  },
  paidAt: {
    type: DataTypes.DATE
  },
  
  // Notas
  customerNotes: {
    type: DataTypes.TEXT
  },
  internalNotes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Orders',
  timestamps: true,
  indexes: [
    { fields: ['orderNumber'] },
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['paymentStatus'] },
    { fields: ['createdAt'] }
  ]
});

// Hook para generar orderNumber
Order.beforeCreate(async (order, options) => {
  const year = new Date().getFullYear();
  
  // Buscamos la última orden de este año para obtener el número más alto
  const lastOrder = await Order.findOne({
    where: {
      orderNumber: { [Op.like]: `ORD-${year}-%` }
    },
    order: [['createdAt', 'DESC']],
    transaction: options.transaction // Importante usar la transacción si existe
  });

  let nextNumber = 1;
  if (lastOrder) {
    // Extraemos el número del final: ORD-2026-00005 -> 5
    const lastNumber = parseInt(lastOrder.orderNumber.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  order.orderNumber = `ORD-${year}-${String(nextNumber).padStart(5, '0')}`;
});

export default Order;