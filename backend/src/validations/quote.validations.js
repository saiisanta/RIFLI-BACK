import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

// Validaciones
export const validateQuote = [
  body('serviceId').isInt().withMessage('Debe ser un ID de servicio válido'),
  body('details').notEmpty().withMessage('Debe ingresar detalles'),
  validateFields
];