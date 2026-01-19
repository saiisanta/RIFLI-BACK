// routes/user.routes.js
import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  getAllUsers,
  getUserById,
  updateProfile,
  changeRole,
  deleteUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
  deleteOwnAccount
} from '../controllers/user.controller.js';
import { validateId } from '../validations/id.validation.js';
import {
  validateUpdateProfile,
  validateChangePassword,
  validateRequestReset,
  validateResetPassword,
  validateChangeRole,
  validateDeleteAccount
} from '../validations/user.validations.js';

const router = express.Router();

// ========== Rutas públicas ==========
router.post('/request-reset', validateRequestReset, requestPasswordReset);
router.post('/reset-password/:token', validateResetPassword,resetPassword);

// ========== Rutas del usuario autenticado ==========
router.get('/me', authenticateToken, getProfile);
router.put('/me', authenticateToken, validateUpdateProfile, updateProfile);
router.put('/change-password', authenticateToken, validateChangePassword, changePassword);
router.delete('/me', authenticateToken, validateDeleteAccount, deleteOwnAccount);

router.get('/', authenticateToken, authorizeRole('ADMIN'), getAllUsers);
router.get('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, getUserById);
router.put('/:id/role', authenticateToken, authorizeRole('ADMIN'), validateChangeRole, changeRole);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, deleteUser);

export default router;