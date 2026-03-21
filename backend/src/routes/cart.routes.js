// routes/cart.routes.js
import express from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cart.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateAddItem, validateUpdateItem } from '../validations/cart.validations.js';

const router = express.Router();

router.use(authenticateToken); // todas requieren auth

router.get('/',                    getCart);
router.post('/items',              validateAddItem,    addItem);
router.put('/items',               validateUpdateItem, updateItem);
router.delete('/items/:product_id', removeItem);
router.delete('/',                 clearCart);

export default router;