import express from 'express';
import * as brandController from '../controllers/brand.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadBrand } from '../middlewares/upload.middleware.js';
import { validateBrand } from '../validations/brands.validations.js';

const router = express.Router();

// Públicas
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Protegidas (admin)
router.post(
  '/',
  authenticateToken,
  authorizeRole('ADMIN'),
  uploadBrand.single('logo_url'),
  validateBrand,
  brandController.createBrand
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  uploadBrand.single('logo_url'),
  validateBrand,
  brandController.updateBrand
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  brandController.deleteBrand
);

export default router;