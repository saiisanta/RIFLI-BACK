import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';
import { param } from 'express-validator';

export const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Apellido requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
  
  body('documentType')
    .trim()
    .notEmpty().withMessage('Tipo de documento requerido')
    .isIn(['DNI', 'CUIL', 'CUIT']).withMessage('Tipo de documento inválido'),
  
  body('documentNumber')
    .trim()
    .notEmpty().withMessage('Número de documento requerido')
    .matches(/^[0-9]{7,8}$/).withMessage('El número de documento debe tener 7 u 8 dígitos'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email demasiado largo'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[0-9\s\-()]+$/).withMessage('Número de teléfono inválido'),
  
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

export const validateVerifyEmail = [
  param('token')
    .isHexadecimal()
    .isLength({ min: 64, max: 64 })
    .withMessage('Token de verificación inválido'),
  validateFields
];