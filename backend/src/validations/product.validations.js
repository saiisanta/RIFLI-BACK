import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

// Validaciones para campos de texto
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Descripción requerida')
    .isLength({ min: 10, max: 500 }).withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  
  body('categoria')
    .trim()
    .notEmpty().withMessage('Categoría requerida')
    .isLength({ min: 3, max: 100 }).withMessage('La categoría debe tener entre 3 y 100 caracteres'),
  
  body('marca')
    .trim()
    .notEmpty().withMessage('Marca requerida')
    .isLength({ max: 50 }).withMessage('La marca demasiado larga'),
  
  body('price')
    .isFloat({ min: 1, max: 1500000 }).withMessage('El precio debe estar entre 0.01 y 999999'),
  
  body('stock')
    .isInt({ min: 0, max: 100000 }).withMessage('El stock debe estar entre 0 y 100000'),
  
  validateFields
];

