// routes/service.routes.js
import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices
} from '../controllers/service.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadService } from '../middlewares/upload.middleware.js';
import {
  validateCreateService,
  validateUpdateService,
  validateReorderServices
} from '../validations/service.validations.js';
import { validateId } from '../validations/id.validation.js';
import { validateServiceBasics } from '../middlewares/preValidation.middleware.js';
import { generalLimiter, uploadAdminLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ========== Rutas Públicas ==========
router.get('/', generalLimiter, getAllServices);
router.get('/:id', generalLimiter, validateId, getServiceById);

// ========== Rutas Protegidas ==========
router.post('/', authenticateToken, authorizeRole('ADMIN'), uploadAdminLimiter, uploadService, validateServiceBasics, validateCreateService, createService);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), uploadAdminLimiter, validateId, uploadService, validateServiceBasics, validateUpdateService, updateService);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, deleteService);
router.patch('/reorder', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateReorderServices, reorderServices);

export default router;