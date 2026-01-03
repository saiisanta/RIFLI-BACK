const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const validateFields = require('../middlewares/validateFields');

// Validaciones
const validateQuote = [
  body('serviceId').isInt().withMessage('Debe ser un ID de servicio válido'),
  body('details').notEmpty().withMessage('Debe ingresar detalles'),
  validateFields
];

// Rutas protegidas
router.get('/', authenticateToken, authorizeRole('admin'), quoteController.getAllQuotes);
router.get('/:id', authenticateToken, quoteController.getQuoteById);
router.post('/', authenticateToken, validateQuote, quoteController.createQuote);
router.put('/:id/status', authenticateToken, authorizeRole('admin'), quoteController.updateQuoteStatus);
router.delete('/:id', authenticateToken, quoteController.deleteQuote);

module.exports = router;