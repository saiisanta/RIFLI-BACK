// routes/bankAccount.routes.js
import express from 'express';
import {
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  toggleBankAccount
} from '../controllers/bankAccount.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { validateBankAccount, validateBankAccountUpdate } from '../validations/bankAccount.validations.js';
import { generalLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ========== Autenticado ==========
router.get('/', authenticateToken, getBankAccount);

// ========== Admin ==========
router.post('/',        authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateBankAccount,       createBankAccount);
router.put('/',         authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateBankAccountUpdate, updateBankAccount);
router.patch('/toggle', authenticateToken, authorizeRole('ADMIN'), generalLimiter,                           toggleBankAccount);

export default router;