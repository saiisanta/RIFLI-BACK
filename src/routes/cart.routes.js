const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Crear un nuevo ítem en el carrito
router.post('/', authenticateToken, cartController.add);

module.exports = router;