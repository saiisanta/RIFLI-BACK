// routes/auth.routes.js
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  verifyEmail, 
  resendVerification 
} from '../controllers/auth.controller.js';
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

export default router;