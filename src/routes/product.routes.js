const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const validateFields = require('../middlewares/validateFields');
const upload = require('../middlewares/uploadMiddleware');

// Validaciones para campos de texto
const validateProduct = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('description').notEmpty().withMessage('Descripción requerida'),
  body('categoria').notEmpty().withMessage('Categoría requerida'),
  body('marca').notEmpty().withMessage('Marca requerida'),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
  validateFields
];

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (con imagen y validación)
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  upload.single('image'),
  validateProduct,
  productController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  upload.single('image'),
  validateProduct,
  productController.updateProduct
);

router.delete('/:id', authenticateToken, authorizeRole('admin'), productController.deleteProduct);

module.exports = router;
