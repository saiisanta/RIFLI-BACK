// validations/category.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción debe tener máximo 500 caracteres'),
  
  body('parent_id')
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 1 }).withMessage('ID de categoría padre inválido'),
  
//   body('order')
//     .optional({ checkFalsy: true })
//     .toInt()
//     .isInt({ min: 0 }).withMessage('El orden debe ser un número positivo'),
  
  body('is_active')
    .optional({ checkFalsy: true })
    .toBoolean()
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];

