import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

// Validaciones
export const validateQuote = [
  body('serviceId')
    .isInt({ min: 1 }).withMessage('Debe ser un ID de servicio válido'),
  
  body('details')
    .trim()
    .notEmpty().withMessage('Debe ingresar detalles')
    .isLength({ min: 10, max: 1000 }).withMessage('Detalles deben tener entre 10 y 1000 caracteres'),
  
  validateFields
];