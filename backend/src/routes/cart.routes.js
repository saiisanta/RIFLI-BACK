// routes/cart.routes.js
import express from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cart.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateAddItem, validateUpdateItem } from '../validations/cart.validations.js';
import { generalLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.use(authenticateToken); // todas requieren auth

router.get('/', generalLimiter, getCart);
router.post('/items', generalLimiter, validateAddItem,    addItem);
router.put('/items', generalLimiter, validateUpdateItem, updateItem);
router.delete('/items/:product_id', generalLimiter, removeItem);
router.delete('/', generalLimiter, clearCart);

export default router;