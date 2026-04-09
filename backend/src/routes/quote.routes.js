// routes/quote.routes.js
import express from 'express';
import {
  createQuote,
  getAllQuotes,
  getQuoteById,
  addBudget,
  uploadBudgetPdf,
  uploadPaymentProof,
  reviewPaymentProof,
  updateQuoteStatus,
  deleteQuote
} from '../controllers/quote.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import {
  uploadPaymentProof as uploadProofMiddleware,
  uploadBudgetPdf as uploadBudgetPdfMiddleware
} from '../middlewares/upload.middleware.js';
import { validateQuoteReferences } from '../middlewares/preValidation.middleware.js';
import { generalLimiter, resendLimiter, resendAdminLimiter, uploadLimiter, uploadAdminLimiter} from '../middlewares/rateLimit.middleware.js';
import {
  validateCreateQuote,
  validateAddBudget,
  validateUploadProof,
  validateReviewProof,
  validateUpdateStatus,
  validateGetQuotes
} from '../validations/quote.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Rutas de Cliente ==========

router.post('/', authenticateToken, validateQuoteReferences, authorizeRole('CLIENT'), resendLimiter,validateCreateQuote, createQuote);
router.get('/', authenticateToken, generalLimiter, validateGetQuotes, getAllQuotes);
router.get('/:id', authenticateToken, generalLimiter, validateId, getQuoteById);
router.post('/:id/payment-proof', authenticateToken, uploadLimiter, validateId, uploadProofMiddleware, validateUploadProof, uploadPaymentProof);
router.patch('/:id/status', authenticateToken, resendLimiter, validateId, validateUpdateStatus, updateQuoteStatus);

// ========== Rutas de Admin ==========

router.put('/:id/budget', authenticateToken, authorizeRole('ADMIN', 'TECHNICIAN'), resendAdminLimiter, validateId, validateAddBudget, addBudget);
router.post('/:id/budget/pdf', authenticateToken, authorizeRole('ADMIN', 'TECHNICIAN'), uploadAdminLimiter, validateId, uploadBudgetPdfMiddleware, uploadBudgetPdf);
router.patch('/:id/review-proof', authenticateToken, authorizeRole('ADMIN'), resendAdminLimiter,validateId, validateReviewProof, reviewPaymentProof);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), generalLimiter, validateId, deleteQuote);

export default router;