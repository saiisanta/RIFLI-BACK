// routes/user.routes.js
import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
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
  deleteOwnAccount,
  updateAvatar,
  deleteAvatar
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
router.patch('/avatar', authenticateToken, uploadAvatar, updateAvatar); 
router.delete('/avatar', authenticateToken, deleteAvatar); 

// ========== Rutas de administrador ==========
router.get('/', authenticateToken, authorizeRole('ADMIN'), getAllUsers);
router.get('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, getUserById);
router.put('/:id/role', authenticateToken, authorizeRole('ADMIN'), validateId, validateChangeRole, changeRole);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateId, deleteUser);

export default router;