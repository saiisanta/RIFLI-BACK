// validations/notification.validations.js
import { query } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

// Validar filtros del GET
export const validateGetNotifications = [
  query('type')
    .optional()
    .isIn(['QUOTE', 'ORDER', 'PAYMENT', 'PROMOTION', 'ADMIN', 'SYSTEM'])
    .withMessage('Tipo de notificación inválido'),
  query('is_read')
    .optional()
    .isBoolean().withMessage('is_read debe ser true o false'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Página inválida'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Límite debe ser entre 1 y 100'),
  validateFields
];