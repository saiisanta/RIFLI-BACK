// models/Quote.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Quote = sequelize.define('Quote', {
  // Referencias
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'services', key: 'id' }
  },
  address_id: { // Dirección donde se hará el trabajo
    type: DataTypes.INTEGER,
    references: { model: 'addresses', key: 'id' }
  },

  // technicianId: { // Técnico asignado
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: { model: 'users', key: 'id' }
  // },

  // Estado
  status: {
    type: DataTypes.ENUM('PENDING', 'QUOTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },

  // Detalles según tipo de servicio (JSON)
  service_details: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Estructura según tipo: Electricidad, Seguridad, Gas'
  },
  /* Ejemplo Electricidad:
  {
    "installationType": "Residential",
    "surfaceM2": 120,
    "phases": "Single",
    "requiresCertificate": true,
    "constructionStatus": "New",
    "requiredVoltage": "220V"
  }
  */

  // Cotización
  quoted_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'ARS'
  },

  // Seña (50%)
  deposit_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  payment_method: {
  type: DataTypes.ENUM('BANK_TRANSFER', 'CASH'),
  allowNull: true
  },
  deposit_payment_status: {
    type: DataTypes.ENUM(
      'PENDING_PROOF',
      'PROOF_UPLOADED',
      'APPROVED',
      'REJECTED',
      'PAID'
    ),
    defaultValue: 'PENDING_PROOF'
  },
  deposit_paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Pago final (50%)
  final_payment_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  final_payment_status: {
    type: DataTypes.ENUM(
      'PENDING',
      'PENDING_PROOF',
      'PROOF_UPLOADED',
      'APPROVED',
      'REJECTED',
      'PAID'
    ),
    defaultValue: 'PENDING'
  },
  final_payment_paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Notas
  client_notes: {
    type: DataTypes.TEXT,
    comment: 'Notas del cliente al solicitar'
  },
  internal_notes: {
    type: DataTypes.TEXT,
    comment: 'Notas internas (solo admin/técnico)'
  },

  // Fechas
  quoted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Validez de la cotización
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true
  },

  deleted_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'quotes',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['client_id'] },
    { fields: ['service_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

export default Quote;