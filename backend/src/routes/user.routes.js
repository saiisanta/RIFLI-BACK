import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { getProfile, getAllUsers, changeRole } from '../controllers/user.controller.js';

const router = express.Router();

// Rutas
router.get('/me', authenticateToken, getProfile);
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);
router.put('/:id/role', authenticateToken, authorizeRole('admin'), changeRole);

export default router;