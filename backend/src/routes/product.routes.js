import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { validateProduct } from '../validations/product.validations.js';

const router = express.Router();

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (con imagen y validación)
router.post(
  '/',
  authenticateToken,
  authorizeRole('ADMIN'),
  upload.single('image'),
  validateProduct,
  productController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  upload.single('image'),
  validateProduct,
  productController.updateProduct
);

router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), productController.deleteProduct);

export default router;