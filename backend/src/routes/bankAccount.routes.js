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

const router = express.Router();

// ========== Autenticado ==========
router.get('/', authenticateToken, getBankAccount);

// ========== Admin ==========
router.post('/',         authenticateToken, authorizeRole('ADMIN'), validateBankAccount,       createBankAccount);
router.put('/',          authenticateToken, authorizeRole('ADMIN'), validateBankAccountUpdate, updateBankAccount);
router.patch('/toggle',  authenticateToken, authorizeRole('ADMIN'),                           toggleBankAccount);

export default router;