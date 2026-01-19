// validations/user.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Contraseña actual requerida'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('La contraseña debe contener: mayúscula, minúscula, número y carácter especial'),
  validateFields
];

export const validateRequestReset = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  validateFields
];

export const validateResetPassword = [
  body('newPassword')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('La contraseña debe contener: mayúscula, minúscula, número y carácter especial'),
  validateFields
];

export const validateUpdateProfile = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[0-9\s\-()]+$/).withMessage('Número de teléfono inválido'),
  body('avatar_url')
    .optional()
    .trim()
    .isURL().withMessage('URL de avatar inválida'),
  validateFields
];

export const validateChangeRole = [
  body('role')
    .isIn(['CLIENT', 'TECHNICIAN', 'ADMIN']).withMessage('Rol inválido'),
  validateFields
];

export const validateDeleteAccount = [
  body('password')
    .notEmpty().withMessage('Contraseña requerida'),
  validateFields
];