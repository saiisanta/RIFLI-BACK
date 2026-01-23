// routes/service.routes.js
import express from 'express';
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from '../controllers/service.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { validateService } from '../validations/service.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Rutas públicas ==========
router.get('/', getAllServices);
router.get('/:id', validateId, getServiceById);

// ========== Rutas protegidas (Admin) ==========
router.post('/', authenticateToken, authorizeRole('ADMIN'), validateService, createService);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, validateService, updateService);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, deleteService);

export default router;