// routes/cart.routes.js
import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Crear un nuevo ítem en el carrito
router.post('/', authenticateToken, cartController.add);

export default router;