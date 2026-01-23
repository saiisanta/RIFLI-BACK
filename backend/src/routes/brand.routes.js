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

const router = express.Router();

// ========== Rutas públicas ==========
router.get('/', getAllBrands);
router.get('/:id', validateId,getBrandById);

// ========== Rutas de administrador ==========
router.post('/', authenticateToken, authorizeRole('ADMIN'), uploadBrand, validateBrand, createBrand);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), uploadBrand, validateId, validateBrand, updateBrand);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, deleteBrand);

export default router;