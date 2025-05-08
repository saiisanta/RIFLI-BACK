const express = require('express');
const router = express.Router();
const quoteService = require('../services/quote.services');

// GET all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await quoteService.getAllQuotes();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET quote by ID
router.get('/:id', async (req, res) => {
  try {
    const quote = await quoteService.getQuoteById(req.params.id);
    quote ? res.json(quote) : res.status(404).json({ error: 'Quote not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new quote
router.post('/', async (req, res) => {
  try {
    const newQuote = await quoteService.createQuote(req.body);
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update quote
router.put('/:id', async (req, res) => {
  try {
    const updatedQuote = await quoteService.updateQuote(req.params.id, req.body);
    updatedQuote ? res.json(updatedQuote) : res.status(404).json({ error: 'Quote not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE quote
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await quoteService.deleteQuote(req.params.id);
    deleted ? res.json({ message: 'Quote deleted' }) : res.status(404).json({ error: 'Quote not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
