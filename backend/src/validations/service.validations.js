// validations/service.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateCreateService = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  body('type')
    .notEmpty().withMessage('El tipo de servicio es requerido')
    .isIn(['ELECTRICITY', 'SECURITY', 'GAS']).withMessage('Tipo de servicio inválido'),
  body('short_description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción corta no puede exceder 500 caracteres'),
  body('long_description')
    .optional()
    .trim(),
  body('features')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error('Features debe ser un array');
          }
        } catch (e) {
          throw new Error('Features debe ser un JSON válido');
        }
      } else if (!Array.isArray(value)) {
        throw new Error('Features debe ser un array');
      }
      return true;
    }),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active debe ser booleano'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('El orden debe ser un número entero positivo'),
  validateFields
];

export const validateUpdateService = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  body('type')
    .optional()
    .isIn(['ELECTRICITY', 'SECURITY', 'GAS']).withMessage('Tipo de servicio inválido'),
  body('short_description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción corta no puede exceder 500 caracteres'),
  body('long_description')
    .optional()
    .trim(),
  body('features')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error('Features debe ser un array');
          }
        } catch (e) {
          throw new Error('Features debe ser un JSON válido');
        }
      } else if (!Array.isArray(value)) {
        throw new Error('Features debe ser un array');
      }
      return true;
    }),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active debe ser booleano'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('El orden debe ser un número entero positivo'),
  validateFields
];

export const validateReorderServices = [
  body('services')
    .isArray().withMessage('Se esperaba un array de servicios')
    .notEmpty().withMessage('El array de servicios no puede estar vacío'),
  body('services.*.id')
    .isInt().withMessage('El ID debe ser un número entero'),
  body('services.*.order')
    .isInt({ min: 0 }).withMessage('El orden debe ser un número entero positivo'),
  validateFields
];