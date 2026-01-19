// models/PaymentProof.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PaymentProof = sequelize.define('PaymentProof', {
  // Referencia (orden o presupuesto)
  relatedType: {
    type: DataTypes.ENUM('ORDER', 'QUOTE'),
    allowNull: false
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  // Usuario que subió el comprobante
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  
  // Tipo de pago
  paymentType: {
    type: DataTypes.ENUM(
      'BANK_TRANSFER',    // Transferencia bancaria
      'CASH',             // Efectivo (en persona)
    ),
    allowNull: false
  },
  
  // Monto
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  
  // Comprobante de transferencia
  proofImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL de la imagen del comprobante (solo para transferencias)'
  },
  
  // Datos de la transferencia
  transactionReference: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'Número de referencia/operación'
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de la transferencia'
  },
  
  // Datos bancarios usados
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  accountNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Últimos 4 dígitos'
  },
  
  // Estado
  status: {
    type: DataTypes.ENUM(
      'PENDING',     // Esperando aprobación
      'APPROVED',    // Aprobado por admin
      'REJECTED',    // Rechazado
      'VERIFIED'     // Verificado (pago confirmado en banco)
    ),
    defaultValue: 'PENDING'
  },
  
  // Notas del usuario
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Revisión del admin
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del admin al aprobar/rechazar'
  },
  rejectionReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'Payment_proofs',
  timestamps: true,
  indexes: [
    { fields: ['relatedType', 'relatedId'] },
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

export default PaymentProof;