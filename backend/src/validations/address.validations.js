// validations/address.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateCreateAddress = [
  body('alias')
    .trim()
    .notEmpty().withMessage('El alias es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El alias debe tener entre 2 y 50 caracteres'),
  
  body('street')
    .trim()
    .notEmpty().withMessage('La calle es requerida')
    .isLength({ max: 255 }).withMessage('La calle no puede exceder 255 caracteres'),
  
  body('number')
    .trim()
    .notEmpty().withMessage('El número es requerido')
    .isLength({ max: 10 }).withMessage('El número no puede exceder 10 caracteres'),
  
  body('floor')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('El piso no puede exceder 10 caracteres'),
  
  body('apartment')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('El departamento no puede exceder 10 caracteres'),
  
  body('city')
    .trim()
    .notEmpty().withMessage('La ciudad es requerida')
    .isLength({ max: 100 }).withMessage('La ciudad no puede exceder 100 caracteres'),
  
  body('province')
    .trim()
    .notEmpty().withMessage('La provincia es requerida')
    .isLength({ max: 100 }).withMessage('La provincia no puede exceder 100 caracteres'),
  
  body('postal_code')
    .trim()
    .notEmpty().withMessage('El código postal es requerido')
    .isLength({ max: 10 }).withMessage('El código postal no puede exceder 10 caracteres'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El país no puede exceder 50 caracteres'),
  
  body('latitude')
    .optional()
    .isDecimal().withMessage('La latitud debe ser un número decimal'),
  
  body('longitude')
    .optional()
    .isDecimal().withMessage('La longitud debe ser un número decimal'),
  
  body('place_id')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('El place_id no puede exceder 255 caracteres'),
  
  body('formatted_address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La dirección formateada no puede exceder 500 caracteres'),
  
  body('additional_info')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La información adicional no puede exceder 1000 caracteres'),
  
  body('is_default')
    .optional()
    .isBoolean().withMessage('is_default debe ser booleano'),
  
  validateFields
];

export const validateUpdateAddress = [
  body('alias')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El alias debe tener entre 2 y 50 caracteres'),
  
  body('street')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('La calle no puede exceder 255 caracteres'),
  
  body('number')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('El número no puede exceder 10 caracteres'),
  
  body('floor')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('El piso no puede exceder 10 caracteres'),
  
  body('apartment')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('El departamento no puede exceder 10 caracteres'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La ciudad no puede exceder 100 caracteres'),
  
  body('province')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La provincia no puede exceder 100 caracteres'),
  
  body('postal_code')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('El código postal no puede exceder 10 caracteres'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El país no puede exceder 50 caracteres'),
  
  body('latitude')
    .optional()
    .isDecimal().withMessage('La latitud debe ser un número decimal'),
  
  body('longitude')
    .optional()
    .isDecimal().withMessage('La longitud debe ser un número decimal'),
  
  body('place_id')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('El place_id no puede exceder 255 caracteres'),
  
  body('formatted_address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La dirección formateada no puede exceder 500 caracteres'),
  
  body('additional_info')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La información adicional no puede exceder 1000 caracteres'),
  
  body('is_default')
    .optional()
    .isBoolean().withMessage('is_default debe ser booleano'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active debe ser booleano'),
  
  validateFields
];