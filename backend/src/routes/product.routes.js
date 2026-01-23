// routes/product.routes.js
import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadProduct } from '../middlewares/upload.middleware.js';
import { validateProduct, validateProductUpdate } from '../validations/product.validations.js';

const router = express.Router();

// Búsqueda y stats
router.get('/search', productController.searchProducts);
router.get('/stats/dashboard', authenticateToken, authorizeRole('ADMIN'), productController.getProductStats);

// CRUD general
router.get('/', productController.getAllProducts);

router.post(
  '/',
  authenticateToken,
  authorizeRole('ADMIN'),
  uploadProduct,
  (req, res, next) => {
    // LOG SÍ MULTER FUNCIONA
    console.log('¿Hay body?:', req.body);
    next();
  },
  validateProduct,
  productController.createProduct
);

// Rutas con :id (al final para evitar conflictos)
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  uploadProduct,
  validateProductUpdate,
  productController.updateProduct
);

router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), productController.deleteProduct);

export default router;