// routes/category.routes.js
import express from 'express';
import { 
  getAllCategories,
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory } 
  from '../controllers/category.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadCategory } from '../middlewares/upload.middleware.js';
import { validateCategory } from '../validations/category.validations.js';
import { validateId } from '../validations/id.validation.js';
import { validateCategoryParent } from '../middlewares/preValidation.middleware.js';
import { generalLimiter, uploadAdminLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ========== Rutas públicas ==========
router.get('/', generalLimiter, getAllCategories);
router.get('/:id', generalLimiter, validateId, getCategoryById);

// ========== Rutas de administrador ==========
router.post('/', authenticateToken, authorizeRole('ADMIN'), uploadAdminLimiter, uploadCategory, validateCategoryParent, validateCategory, createCategory);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), uploadAdminLimiter, uploadCategory, validateCategoryParent,validateId, validateCategory, updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, deleteCategory);

export default router;