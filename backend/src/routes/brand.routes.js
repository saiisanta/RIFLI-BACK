// routes/brand.routes.js
import express from 'express';
import { 
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  getBrandById
} from '../controllers/brand.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadBrand } from '../middlewares/upload.middleware.js';
import { validateBrand } from '../validations/brands.validations.js';
import { validateId } from '../validations/id.validation.js';
import { validateBrandName } from '../middlewares/preValidation.middleware.js';
import { generalLimiter, uploadAdminLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ========== Rutas públicas ==========
router.get('/', generalLimiter, getAllBrands);
router.get('/:id', generalLimiter, validateId, getBrandById);

// ========== Rutas de administrador ==========
router.post('/', authenticateToken, authorizeRole('ADMIN'), uploadAdminLimiter, uploadBrand, validateBrandName, validateBrand, createBrand);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), uploadAdminLimiter, uploadBrand, validateBrandName, validateId, validateBrand, updateBrand);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, deleteBrand);

export default router;