// models/Quote.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Quote = sequelize.define('Quote', {
  // ========== REFERENCIAS ==========
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
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  
    references: { model: 'addresses', key: 'id' }
  },

  // assigned_technician_id: {  
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: { model: 'users', key: 'id' }
  // },

  // ========== DATOS DEL SERVICIO (SNAPSHOT) ==========

  service_type: { 
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Tipo de servicio al momento de la cotización'
  },

  // ========== ESTADO ==========
  status: {
    type: DataTypes.ENUM(
      'PENDING',      // Cliente solicitó, esperando cotización
      'QUOTED',       // Admin envió cotización
      'ACCEPTED',     // Cliente aceptó cotización
      'REJECTED',     // Cliente rechazó cotización
      'IN_PROGRESS',  // Trabajo en progreso
      'COMPLETED',    // Trabajo completado
      'CANCELLED'     // Cancelado (por cualquier motivo)
    ),
    defaultValue: 'PENDING'
  },

  // ========== DETALLES DEL FORMULARIO DINÁMICO ==========
  service_details: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Respuestas del formulario dinámico del servicio'
  },
  /* Ejemplo basado en form_schema del servicio:
  {
    "tipo_instalacion": "Residencial",
    "superficie_m2": 120,
    "fases": "Monofásica",
    "requiere_certificado": true,
    "voltaje": "220V",
    "calidad_materiales": "intermedio" 
  }
  */

  // ========== PRESUPUESTO DE MATERIALES ==========
  materials_budget: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Detalle de materiales con precios'
  },
  /* Ejemplo:
  {
    "items": [
      {
        "id": "mat_1",
        "description": "Cable 2.5mm x 100m",
        "quantity": 2,
        "unit": "rollo",
        "unit_price": 15000,
        "subtotal": 30000,
        "notes": "Marca X, calidad intermedia"
      },
      {
        "id": "mat_2",
        "description": "Disyuntor 10A",
        "quantity": 5,
        "unit": "unidad",
        "unit_price": 3500,
        "subtotal": 17500
      }
    ],
    "total": 47500
  }
  */

  // ========== PRESUPUESTO DE MANO DE OBRA ==========
  labor_budget: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Detalle de mano de obra con precios'
  },
  /* Ejemplo:
  {
    "items": [
      {
        "id": "labor_1",
        "description": "Instalación de cableado",
        "hours": 8,
        "hourly_rate": 5000,
        "subtotal": 40000,
      },
      {
        "id": "labor_2",
        "description": "Instalación de tablero",
        "hours": 4,
        "hourly_rate": 5000,
        "subtotal": 20000
      }
    ],
    "total": 60000
  }
  */

  // ========== TOTALES DE COTIZACIÓN ==========
  materials_subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Subtotal de materiales'
  },
  labor_subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Subtotal de mano de obra'
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Descuento aplicado en porcentaje'
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monto del descuento en pesos'
  },
  tax_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 21,  // IVA en Argentina
    comment: 'Impuesto (IVA) en porcentaje'
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monto del impuesto'
  },
  quoted_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monto total cotizado (materiales + mano de obra + impuestos - descuentos)'
  },
  currency: {
    type: DataTypes.ENUM('USD', 'ARS'),
    defaultValue: 'ARS'
  },

  // ========== PAGOS - SEÑA (50%) ==========
  deposit_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 50,
    comment: 'Porcentaje de seña (por defecto 50%)'
  },
  deposit_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monto de la seña'
  },
  payment_method: {
    type: DataTypes.ENUM('BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD'),
    allowNull: true
  },
  deposit_payment_status: {
    type: DataTypes.ENUM(
      'PENDING',          // Esperando pago
      'PENDING_PROOF',    // Esperando comprobante
      'PROOF_UPLOADED',   // Comprobante subido, esperando verificación
      'APPROVED',         // Pago verificado y aprobado
      'REJECTED',         // Comprobante rechazado
      'PAID'              // Pago confirmado
    ),
    defaultValue: 'PENDING'
  },
  deposit_proof_url: { 
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL del comprobante de pago de la seña'
  },
  deposit_paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // ========== PAGOS - PAGO FINAL (50%) ==========
  final_payment_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monto del pago final'
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
  final_proof_url: { 
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL del comprobante del pago final'
  },
  final_payment_paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // ========== NOTAS ==========
  client_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del cliente al solicitar'
  },
  internal_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas internas (solo admin/técnico)'
  },
  rejection_reason: {  
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Razón del rechazo (si status = REJECTED o CANCELLED)'
  },

  // ========== FECHAS ==========
  quoted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha en que se envió la cotización'
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha en que el cliente aceptó'
  },
  rejected_at: {  // ← Nuevo campo
    type: DataTypes.DATE,
    allowNull: true
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de inicio del trabajo'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de finalización del trabajo'
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de validez de la cotización'
  },

  // ========== METADATA ==========
  quote_number: {  
    type: DataTypes.STRING(50),
    unique: true,
    comment: 'Número único de cotización (ej: QUOTE-2026-00001)'
  },
  estimated_completion_days: {  // ← Nuevo campo
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Días estimados para completar el trabajo'
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
    { fields: ['created_at'] },
    { fields: ['quote_number'], unique: true }
  ]
});

export default Quote;