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

const router = express.Router();

// ========== Rutas Públicas ==========
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// ========== Rutas Protegidas ==========
router.post('/', authenticateToken, authorizeRole('ADMIN'), uploadService, validateCreateService, createService);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), uploadService, validateUpdateService, updateService);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteService);
router.patch('/reorder', authenticateToken, authorizeRole('ADMIN'), validateReorderServices, reorderServices);

export default router;