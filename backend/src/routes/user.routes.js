// routes/user.routes.js
import express from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import { uploadLimiter, generalLimiter } from '../middlewares/rateLimit.middleware.js';
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
  validateDeleteAccount,
  validateGetUsers
} from '../validations/user.validations.js';

const router = express.Router();

// ========== Rutas públicas ==========
router.post('/request-reset', generalLimiter, validateRequestReset, requestPasswordReset);
router.post('/reset-password/:token', generalLimiter, validateResetPassword, resetPassword);

// ========== Rutas del usuario autenticado ==========
router.get('/me', authenticateToken, generalLimiter, getProfile);
router.put('/me', authenticateToken, generalLimiter, validateUpdateProfile, updateProfile);
router.delete('/me', authenticateToken, generalLimiter, validateDeleteAccount, deleteOwnAccount);
router.put('/change-password', authenticateToken, generalLimiter, validateChangePassword, changePassword);
router.patch('/avatar', authenticateToken, uploadLimiter, uploadAvatar, updateAvatar); 
router.delete('/avatar', authenticateToken, generalLimiter, deleteAvatar); 

// ========== Rutas de administrador ==========
router.get('/', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateGetUsers, getAllUsers);
router.get('/:id', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, getUserById);
router.put('/:id/role', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, validateChangeRole, changeRole);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, deleteUser);

export default router;