import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { validateService } from '../validations/service.validations.js';

const router = express.Router();

// Rutas públicas
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Rutas protegidas (admin)
router.post('/', authenticateToken, authorizeRole('admin'), validateService, serviceController.createService);
router.put('/:id', authenticateToken, authorizeRole('admin'), validateService, serviceController.updateService);
router.delete('/:id', authenticateToken, authorizeRole('admin'), serviceController.deleteService);

export default router;