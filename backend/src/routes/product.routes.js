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
import { validateProductReferences } from '../middlewares/preValidation.middleware.js';
import { generalLimiter, uploadAdminLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ========== Rutas específicas ==========
router.get('/search', generalLimiter, searchProducts);
router.get('/stats/dashboard', generalLimiter, authenticateToken, authorizeRole('ADMIN'), getProductStats);

// ========== Crud General ==========
router.get('/', generalLimiter, getAllProducts);
router.post('/', uploadAdminLimiter, authenticateToken,authorizeRole('ADMIN'), uploadProduct, validateProductReferences, validateProduct, createProduct);

// ========== Rutas por ID ==========
router.get('/:id', generalLimiter, validateId, getProductById);
router.get('/:id/related', generalLimiter, validateId, getRelatedProducts);
router.put('/:id', uploadAdminLimiter, authenticateToken, authorizeRole('ADMIN'), uploadProduct, validateProductReferences, validateId, validateProductUpdate, updateProduct);
router.delete('/:id', generalLimiter, authenticateToken, authorizeRole('ADMIN'), validateId, deleteProduct);

export default router;