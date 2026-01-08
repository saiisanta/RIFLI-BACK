import { param } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido'),
  validateFields
];