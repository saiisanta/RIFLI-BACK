import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

// Validaciones para campos de texto
export const validateProduct = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('description').notEmpty().withMessage('Descripción requerida'),
  body('categoria').notEmpty().withMessage('Categoría requerida'),
  body('marca').notEmpty().withMessage('Marca requerida'),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
  validateFields
];

