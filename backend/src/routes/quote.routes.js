import express from 'express';
import * as quoteController from '../controllers/quote.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { validateQuote } from '../validations/quote.validations.js';

const router = express.Router();

// Rutas protegidas
router.get('/', authenticateToken, authorizeRole('ADMIN'), quoteController.getAllQuotes);
router.get('/:id', authenticateToken, quoteController.getQuoteById);
router.post('/', authenticateToken, validateQuote, quoteController.createQuote);
router.put('/:id/status', authenticateToken, authorizeRole('ADMIN'), quoteController.updateQuoteStatus);
router.delete('/:id', authenticateToken, quoteController.deleteQuote);

export default router;