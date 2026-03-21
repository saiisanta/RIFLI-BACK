// validations/order.validations.js — mismas que antes, sin cambios
import { body, query } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateCreateOrder = [
  body('address_id')
    .isInt({ min: 1 }).withMessage('address_id inválido'),
  body('payment_method')
    .isIn(['BANK_TRANSFER', 'CASH']).withMessage('Método de pago inválido'),
  body('customer_notes')
    .optional().trim()
    .isLength({ max: 1000 }).withMessage('Las notas no pueden exceder 1000 caracteres'),
  validateFields
];

export const validateSetShipping = [
  body('shipping_cost')
    .isFloat({ min: 0 }).withMessage('El costo de envío debe ser un número positivo'),
  body('internal_notes')
    .optional().trim().isLength({ max: 2000 }),
  validateFields
];

export const validateReviewOrderProof = [
  body('proof_id')
    .isInt({ min: 1 }).withMessage('proof_id inválido'),
  body('action')
    .isIn(['approve', 'reject']).withMessage('action debe ser "approve" o "reject"'),
  body('rejection_reason')
    .if(body('action').equals('reject'))
    .notEmpty().withMessage('rejection_reason requerido al rechazar')
    .isLength({ max: 500 }),
  body('admin_notes')
    .optional().trim().isLength({ max: 1000 }),
  validateFields
];

export const validateUpdateOrderStatus = [
  body('status')
    .isIn(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
    .withMessage('Estado inválido'),
  body('tracking_number')
    .if(body('status').equals('SHIPPED'))
    .optional().trim().isLength({ max: 100 }),
  body('cancellation_reason')
    .if(body('status').equals('CANCELLED'))
    .optional().trim().isLength({ max: 500 }),
  validateFields
];

export const validateGetOrders = [
  query('status')
    .optional()
    .isIn(['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  query('payment_status')
    .optional()
    .isIn(['PENDING_PROOF', 'PROOF_UPLOADED', 'APPROVED', 'REJECTED', 'PAID']),
  query('shipping_status')
    .optional()
    .isIn(['PENDING', 'QUOTED']),
  query('from_date').optional().isISO8601(),
  query('to_date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateFields
];
