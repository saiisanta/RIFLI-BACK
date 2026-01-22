// validations/brand.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateBrand = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('is_active')
    .optional({ checkFalsy: true })
    .toBoolean()
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];