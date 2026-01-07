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
  body('token')
    .notEmpty().withMessage('Token requerido'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('La contraseña debe contener: mayúscula, minúscula, número y carácter especial'),
  validateFields
];

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido'),
  validateFields
];

export const validateChangeRole = [
  body('role')
    .isIn(['user', 'admin']).withMessage('Rol inválido'),
  validateFields
];

export const validateDeleteAccount = [
  body('password')
    .notEmpty().withMessage('Contraseña requerida'),
  validateFields
];