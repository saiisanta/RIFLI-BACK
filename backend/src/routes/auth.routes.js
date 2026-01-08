// routes/auth.routes.js
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  verifyEmail, 
  resendVerification 
} from '../controllers/auth.controller.js';
import { validateRegister, validateLogin, validateVerifyEmail} from '../validations/auth.validations.js';
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';

const router = express.Router();

// Registro y verificación
router.post('/register', validateRegister, register);
router.get('/verify-email/:token', validateVerifyEmail, verifyEmail);
router.post('/resend-verification', [
  body('email').trim().isEmail().withMessage('Email inválido'),
  validateFields
], resendVerification);

// Login y logout
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;