import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Quote = sequelize.define('Quote', {
  // Referencias
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'services', key: 'id' }
  },
  addressId: { // Dirección donde se hará el trabajo
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
  serviceDetails: {
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
  quotedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'ARS'
  },
  
  // Seña (50%)
  depositAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  paymentMethod: {
  type: DataTypes.ENUM('BANK_TRANSFER', 'CASH'),
  allowNull: true
  },
  depositPaymentStatus: {
    type: DataTypes.ENUM(
      'PENDING_PROOF',
      'PROOF_UPLOADED',
      'APPROVED',
      'REJECTED',
      'PAID'
    ),
    defaultValue: 'PENDING_PROOF'
  },
  depositPaidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Pago final (50%)
  finalPaymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  finalPaymentStatus: {
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
  finalPaymentPaidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Notas
  clientNotes: {
    type: DataTypes.TEXT,
    comment: 'Notas del cliente al solicitar'
  },
  internalNotes: {
    type: DataTypes.TEXT,
    comment: 'Notas internas (solo admin/técnico)'
  },
  
  // Fechas
  quotedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Validez de la cotización
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'Quotes',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['clientId'] },
    { fields: ['serviceId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

export default Quote;