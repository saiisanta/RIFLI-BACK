// routes/product.routes.js
import express from 'express';
import {
  searchProducts,
  getProductStats,
  getAllProducts,
  createProduct,
  getProductById,
  getRelatedProducts,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadProduct } from '../middlewares/upload.middleware.js';
import { validateProduct, validateProductUpdate } from '../validations/product.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Rutas específicas ==========
router.get('/search', searchProducts);
router.get('/stats/dashboard', authenticateToken, authorizeRole('ADMIN'), getProductStats);

// ========== Crud General ==========
router.get('/', getAllProducts);
router.post('/',authenticateToken,authorizeRole('ADMIN'),uploadProduct,validateProduct, createProduct);

// ========== Rutas por ID ==========
router.get('/:id', validateId, getProductById);
router.get('/:id/related', validateId, getRelatedProducts);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), uploadProduct, validateId, validateProductUpdate, updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, deleteProduct);

export default router;