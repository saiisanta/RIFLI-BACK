// routes/quote.routes.js
import express from 'express';
import {
  createQuote,
  getAllQuotes,
  getQuoteById,
  addBudget,
  uploadPaymentProof,
  reviewPaymentProof,
  updateQuoteStatus,
  deleteQuote
} from '../controllers/quote.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadPaymentProof as uploadProof } from '../middlewares/upload.middleware.js';
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
// Crear cotización (cliente proporciona datos iniciales)
router.post('/', 
  authenticateToken,
  validateQuoteReferences,     
  validateCreateQuote,
  createQuote
);

// Ver mis cotizaciones (cliente solo ve las suyas, admin ve todas)
router.get('/', 
  authenticateToken,
  getAllQuotes
);

// Ver cotización específica
router.get('/:id', 
  authenticateToken,
  validateId,
  getQuoteById
);

// Subir comprobante de pago (seña o pago final)
router.post('/:id/payment-proof', 
  authenticateToken,
  validateId,
  uploadProof,                  
  validateUploadProof,
  uploadPaymentProof
);

// Actualizar estado (cliente puede aceptar/rechazar)
router.patch('/:id/status', 
  authenticateToken,
  validateId,
  validateUpdateStatus,
  updateQuoteStatus
);

// ========== Rutas de Admin/Técnico ==========
// Agregar presupuesto (materiales + mano de obra)
router.put('/:id/budget', 
  authenticateToken,
  authorizeRole('ADMIN', 'TECHNICIAN'),
  validateId,
  validateAddBudget,
  addBudget
);

// Aprobar/rechazar comprobante de pago
router.patch('/:id/review-proof', 
  authenticateToken,
  authorizeRole('ADMIN'),
  validateId,
  validateReviewProof,
  reviewPaymentProof
);

// Soft delete
router.delete('/:id', 
  authenticateToken,
  authorizeRole('ADMIN'),
  validateId,
  deleteQuote
);

export default router;