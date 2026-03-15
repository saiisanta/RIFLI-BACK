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
import {
  validateCreateQuote,
  validateAddBudget,
  validateUploadProof,
  validateReviewProof,
  validateUpdateStatus
} from '../validations/quote.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Rutas de Cliente ==========

router.post('/',
  authenticateToken,
  validateQuoteReferences,
  validateCreateQuote,
  createQuote
);

router.get('/',
  authenticateToken,
  getAllQuotes
);

router.get('/:id',
  authenticateToken,
  validateId,
  getQuoteById
);

router.post('/:id/payment-proof',
  authenticateToken,
  validateId,
  uploadProofMiddleware,
  validateUploadProof,
  uploadPaymentProof
);

router.patch('/:id/status',
  authenticateToken,
  validateId,
  validateUpdateStatus,
  updateQuoteStatus
);

// ========== Rutas de Admin ==========

router.put('/:id/budget',
  authenticateToken,
  authorizeRole('ADMIN', 'TECHNICIAN'),
  validateId,
  validateAddBudget,
  addBudget
);

// NUEVO: subir PDF generado desde el front
router.post('/:id/budget/pdf',
  authenticateToken,
  authorizeRole('ADMIN', 'TECHNICIAN'),
  validateId,
  uploadBudgetPdfMiddleware,
  uploadBudgetPdf
);

router.patch('/:id/review-proof',
  authenticateToken,
  authorizeRole('ADMIN'),
  validateId,
  validateReviewProof,
  reviewPaymentProof
);

router.delete('/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  validateId,
  deleteQuote
);

export default router;