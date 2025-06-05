const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const validateFields = require('../middlewares/validateFields');

// Validaciones
const validateProduct = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('description').notEmpty().withMessage('Descripción requerida'),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
  validateFields
];

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, authorizeRole('admin'), validateProduct, productController.createProduct);
router.put('/:id', authenticateToken, authorizeRole('admin'), validateProduct, productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('admin'), productController.deleteProduct);

module.exports = router;