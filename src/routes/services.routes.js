const express = require('express');
const router = express.Router();
const { Service } = require('../models');

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el servicio' });
  }
});

// Crear un nuevo servicio
router.post('/', async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear servicio' });
  }
});

// Actualizar un servicio
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
    await service.update(req.body);
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar servicio' });
  }
});

// Eliminar un servicio
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
    await service.destroy();
    res.json({ message: 'Servicio eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

module.exports = router;
