// routes/auth.routes.js
import express from 'express';
import { 
  register, 
  login, 
  logout,
  getCurrentUser,
  verifyEmail, 
  resendVerification 
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { 
  validateRegister,
  validateLogin, 
  validateResendEmail, 
  validateVerifyEmail
} from '../validations/auth.validations.js';

const router = express.Router();

// ========== Registro y verificación ==========
router.post('/register', validateRegister, register);
router.get('/verify-email/:token', validateVerifyEmail, verifyEmail);
router.post('/resend-verification', validateResendEmail, resendVerification);

// ========== Login y Logout ==========
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// ========== Usuario actual ==========
router.get('/me', authenticateToken, getCurrentUser);

export default router;