import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadCategory } from '../middlewares/upload.middleware.js';
import { validateCategory } from '../validations/category.validations.js';

const router = express.Router();

// Públicas
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protegidas (admin)
router.post(
  '/',
  authenticateToken,
  authorizeRole('ADMIN'),
  uploadCategory,
  validateCategory,
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  uploadCategory,
  validateCategory,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  categoryController.deleteCategory
);

export default router;