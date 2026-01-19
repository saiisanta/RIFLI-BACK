// models/PaymentProof.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PaymentProof = sequelize.define('PaymentProof', {
  // Referencia (orden o presupuesto)
  related_type: {
    type: DataTypes.ENUM('ORDER', 'QUOTE'),
    allowNull: false
  },
  related_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Usuario que subió el comprobante
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },

  // Tipo de pago
  payment_type: {
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
  proof_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL de la imagen del comprobante (solo para transferencias)'
  },

  // Datos de la transferencia
  transaction_reference: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'Número de referencia/operación'
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de la transferencia'
  },

  // Datos bancarios usados
  bank_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  account_number: {
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
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del admin al aprobar/rechazar'
  },
  rejection_reason: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'payment_proofs',
  timestamps: true,
  indexes: [
    { fields: ['related_type', 'related_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

export default PaymentProof;