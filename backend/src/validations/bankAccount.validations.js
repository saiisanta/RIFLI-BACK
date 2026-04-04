// validations/bankAccount.validations.js
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateBankAccount = [
  body('bank_name')
    .trim().notEmpty().withMessage('Nombre del banco requerido')
    .isLength({ max: 100 }),
  body('account_type')
    .isIn(['SAVINGS', 'CHECKING']).withMessage('Tipo de cuenta inválido'),
  body('account_number')
    .trim().notEmpty().withMessage('Número de cuenta requerido')
    .isLength({ max: 50 }),
  body('cbu')
    .trim().notEmpty().withMessage('CBU requerido')
    .isLength({ min: 22, max: 22 }).withMessage('El CBU debe tener exactamente 22 dígitos')
    .isNumeric().withMessage('El CBU solo puede contener números'),
  body('alias')
    .optional().trim()
    .isLength({ max: 50 }).withMessage('El alias no puede exceder 50 caracteres'),
  body('holder_name')
    .trim().notEmpty().withMessage('Nombre del titular requerido')
    .isLength({ max: 255 }),
  body('holder_document')
    .trim().notEmpty().withMessage('Documento del titular requerido')
    .isLength({ max: 20 }),
  body('holder_cuit')
    .trim().notEmpty().withMessage('CUIT requerido')
    .matches(/^[0-9]{11}$/).withMessage('El CUIT debe tener exactamente 11 dígitos'),
  validateFields
];

export const validateBankAccountUpdate = [
  body('bank_name')
    .optional().trim().isLength({ max: 100 }),
  body('account_type')
    .optional().isIn(['SAVINGS', 'CHECKING']).withMessage('Tipo de cuenta inválido'),
  body('account_number')
    .optional().trim().isLength({ max: 50 }),
  body('cbu')
    .optional().trim()
    .isLength({ min: 22, max: 22 }).withMessage('El CBU debe tener exactamente 22 dígitos')
    .isNumeric().withMessage('El CBU solo puede contener números'),
  body('alias')
    .optional().trim().isLength({ max: 50 }),
  body('holder_name')
    .optional().trim().isLength({ max: 255 }),
  body('holder_document')
    .optional().trim().isLength({ max: 20 }),
  body('holder_cuit')
    .optional()
    .matches(/^[0-9]{11}$/).withMessage('El CUIT debe tener exactamente 11 dígitos'),
  validateFields
];