const { body, param } = require('express-validator');

const validateUser = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

const validateProduct = [
  body('name').notEmpty(),
  body('price').isNumeric().withMessage('Precio inválido')
];

const validateService = [
  body('name').notEmpty(),
  body('description').isLength({ min: 10 }).withMessage('Descripción demasiado corta')
];

const validateQuote = [
  body('userId').isInt(),
  body('serviceId').isInt(),
  body('description').notEmpty()
];

const validateCart = [
  body('userId').isInt(),
  body('productId').isInt(),
  body('quantity').isInt({ min: 1 })
];

module.exports = {
  validateUser,
  validateLogin,
  validateProduct,
  validateService,
  validateQuote,
  validateCart
};
