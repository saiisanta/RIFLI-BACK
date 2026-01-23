// routes/quote.routes.js
import express from 'express';
import {
    getAllQuotes,
    getQuoteById,
    createQuote,
    updateQuoteStatus,
    deleteQuote
} from '../controllers/quote.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { validateQuote } from '../validations/quote.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Rutas Protegidas ==========
router.get('/', authenticateToken, authorizeRole('ADMIN'), getAllQuotes);
router.get('/:id', authenticateToken, validateId, getQuoteById);
router.post('/', authenticateToken, validateQuote, createQuote);
router.put('/:id/status', authenticateToken, authorizeRole('ADMIN'), validateId,updateQuoteStatus);
router.delete('/:id', authenticateToken, validateId, deleteQuote);

export default router;