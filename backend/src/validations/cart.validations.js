// validations/cart.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateAddItem = [
  body('product_id')
    .isInt({ min: 1 }).withMessage('product_id inválido'),
  body('quantity')
    .isInt({ min: 1, max: 100 }).withMessage('La cantidad debe ser entre 1 y 100'),
  validateFields
];

export const validateUpdateItem = [
  body('product_id')
    .isInt({ min: 1 }).withMessage('product_id inválido'),
  body('quantity')
    .isInt({ min: 1, max: 100 }).withMessage('La cantidad debe ser entre 1 y 100'),
  validateFields
];