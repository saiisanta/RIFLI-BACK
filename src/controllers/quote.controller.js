const { Quote, Service, User } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todas las solicitudes (solo admin)
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.findAll({
      include: [Service, User]
    });
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener presupuestos' });
  }
};

// Obtener solicitud por ID (admin o dueño)
exports.getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id, {
      include: [Service, User]
    });

    if (!quote) return res.status(404).json({ error: 'Presupuesto no encontrado' });

    if (req.user.role !== 'admin' && req.user.id !== quote.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar el presupuesto' });
  }
};

// Crear solicitud (usuario logueado)
exports.createQuote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newQuote = await Quote.create({
      userId: req.user.id,
      serviceId: req.body.serviceId,
      details: req.body.details,
      status: 'pendiente'
    });
    res.status(201).json(newQuote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear presupuesto' });
  }
};

// Actualizar estado (solo admin)
exports.updateQuoteStatus = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Presupuesto no encontrado' });

    quote.status = req.body.status;
    await quote.save();

    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado del presupuesto' });
  }
};

// Eliminar presupuesto (usuario dueño o admin)
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Presupuesto no encontrado' });

    if (req.user.role !== 'admin' && req.user.id !== quote.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await quote.destroy();
    res.json({ message: 'Presupuesto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};