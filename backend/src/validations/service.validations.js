import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

// Validaciones para crear/editar servicio
export const validateService = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('Nombre debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10, max: 1000 }).withMessage('Descripción debe tener entre 10 y 500 caracteres'),
  
  validateFields
];