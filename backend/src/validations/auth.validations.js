import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

// Validaciones
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('Email demasiado largo'),
  
  body('password')
    .notEmpty().withMessage('Contraseña requerida')
    .isLength({ min: 8 }).withMessage('Contraseña mínima de 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage('La contraseña debe contener: mayúscula, minúscula, número y carácter especial (@$!%*?&#)'),
  
  validateFields
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  validateFields
];