const express = require('express');
const router = express.Router();
const cartService = require('../services/cart.services');

// GET all carts
router.get('/', async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET cart by ID
router.get('/:id', async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    cart ? res.json(cart) : res.status(404).json({ error: 'Cart not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new cart
router.post('/', async (req, res) => {
  try {
    const newCart = await cartService.createCart(req.body);
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update cart
router.put('/:id', async (req, res) => {
  try {
    const updatedCart = await cartService.updateCart(req.params.id, req.body);
    updatedCart ? res.json(updatedCart) : res.status(404).json({ error: 'Cart not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cart
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await cartService.deleteCart(req.params.id);
    deleted ? res.json({ message: 'Cart deleted' }) : res.status(404).json({ error: 'Cart not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
