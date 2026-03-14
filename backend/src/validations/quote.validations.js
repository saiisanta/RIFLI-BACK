// validations/quote.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

// ========== Crear Cotización (Cliente) ==========
export const validateCreateQuote = [
  body('service_id')
    .isInt().withMessage('service_id debe ser un número entero'),
  body('address_id')
    .isInt().withMessage('address_id debe ser un número entero'),
  body('service_details')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          throw new Error('service_details debe ser un JSON válido');
        }
      } else if (typeof value !== 'object') {
        throw new Error('service_details debe ser un objeto JSON');
      }
      return true;
    }),
  body('client_notes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Las notas no pueden exceder 2000 caracteres'),
  validateFields
];

// ========== Agregar Presupuesto (Admin) ==========
export const validateAddBudget = [
  body('materials_budget')
    .notEmpty().withMessage('materials_budget es requerido')
    .custom((value) => {
      let budget;
      
      if (typeof value === 'string') {
        try {
          budget = JSON.parse(value);
        } catch (e) {
          throw new Error('materials_budget debe ser un JSON válido');
        }
      } else {
        budget = value;
      }
      
      if (!budget.items || !Array.isArray(budget.items)) {
        throw new Error('materials_budget debe contener un array "items"');
      }
      
      if (!budget.total || typeof budget.total !== 'number') {
        throw new Error('materials_budget debe contener un "total" numérico');
      }
      
      // Validar estructura de cada item
      budget.items.forEach((item, index) => {
        if (!item.description || typeof item.description !== 'string') {
          throw new Error(`Material ${index}: "description" es requerido`);
        }
        if (item.quantity === undefined || typeof item.quantity !== 'number') {
          throw new Error(`Material ${index}: "quantity" es requerido y debe ser numérico`);
        }
        if (item.unit_price === undefined || typeof item.unit_price !== 'number') {
          throw new Error(`Material ${index}: "unit_price" es requerido y debe ser numérico`);
        }
        if (item.subtotal === undefined || typeof item.subtotal !== 'number') {
          throw new Error(`Material ${index}: "subtotal" es requerido y debe ser numérico`);
        }
      });
      
      return true;
    }),
  
  body('labor_budget')
    .notEmpty().withMessage('labor_budget es requerido')
    .custom((value) => {
      let budget;
      
      if (typeof value === 'string') {
        try {
          budget = JSON.parse(value);
        } catch (e) {
          throw new Error('labor_budget debe ser un JSON válido');
        }
      } else {
        budget = value;
      }
      
      if (!budget.items || !Array.isArray(budget.items)) {
        throw new Error('labor_budget debe contener un array "items"');
      }
      
      if (!budget.total || typeof budget.total !== 'number') {
        throw new Error('labor_budget debe contener un "total" numérico');
      }
      
      // Validar estructura de cada item
      budget.items.forEach((item, index) => {
        if (!item.description || typeof item.description !== 'string') {
          throw new Error(`Labor ${index}: "description" es requerido`);
        }
        if (item.hours === undefined || typeof item.hours !== 'number') {
          throw new Error(`Labor ${index}: "hours" es requerido y debe ser numérico`);
        }
        if (item.hourly_rate === undefined || typeof item.hourly_rate !== 'number') {
          throw new Error(`Labor ${index}: "hourly_rate" es requerido y debe ser numérico`);
        }
        if (item.subtotal === undefined || typeof item.subtotal !== 'number') {
          throw new Error(`Labor ${index}: "subtotal" es requerido y debe ser numérico`);
        }
      });
      
      return true;
    }),
  
  body('discount_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('discount_percentage debe estar entre 0 y 100'),
  
  body('tax_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('tax_percentage debe estar entre 0 y 100'),
  
  body('valid_until')
    .optional()
    .isISO8601().withMessage('valid_until debe ser una fecha válida'),
  
  body('estimated_completion_days')
    .optional()
    .isInt({ min: 1 }).withMessage('estimated_completion_days debe ser un número entero positivo'),
  
  body('internal_notes')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Las notas internas no pueden exceder 5000 caracteres'),
  
  validateFields
];

// ========== Subir Comprobante de Pago ==========
export const validateUploadProof = [
  body('payment_type')
    .notEmpty().withMessage('payment_type es requerido')
    .isIn(['deposit', 'final']).withMessage('payment_type debe ser "deposit" o "final"'),
  validateFields
];

// ========== Revisar Comprobante (Admin) ==========
export const validateReviewProof = [
  body('payment_type')
    .notEmpty().withMessage('payment_type es requerido')
    .isIn(['deposit', 'final']).withMessage('payment_type debe ser "deposit" o "final"'),
  
  body('action')
    .notEmpty().withMessage('action es requerido')
    .isIn(['approve', 'reject']).withMessage('action debe ser "approve" o "reject"'),
  
  body('rejection_reason')
    .if(body('action').equals('reject'))
    .notEmpty().withMessage('rejection_reason es requerido cuando se rechaza')
    .trim()
    .isLength({ max: 500 }).withMessage('rejection_reason no puede exceder 500 caracteres'),
  
  validateFields
];

// ========== Actualizar Estado ==========
export const validateUpdateStatus = [
  body('status')
    .notEmpty().withMessage('status es requerido')
    .isIn(['PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Estado inválido'),
  
  body('rejection_reason')
    .if(body('status').isIn(['REJECTED', 'CANCELLED']))
    .notEmpty().withMessage('rejection_reason es requerido cuando se rechaza o cancela')
    .trim()
    .isLength({ max: 1000 }).withMessage('rejection_reason no puede exceder 1000 caracteres'),
  
  body('assigned_technician_id')
    .optional()
    .isInt().withMessage('assigned_technician_id debe ser un número entero'),
  
  validateFields
];