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
    // Convierte "" o "null" en null real
    .customSanitizer(value => (value === '' || value === 'null' ? null : value))
    .optional({ nullable: true })
    .toInt()
    .custom((value) => {
      if (value !== null && isNaN(value)) {
        throw new Error('ID de categoría padre inválido');
      }
      return true;
    }),
  
  body('is_active')
    .optional({ checkFalsy: true })
    .toBoolean()
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];