const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const validateFields = require('../middlewares/validateFields');

// Validaciones para crear/editar servicio
const validateService = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  validateFields
];

// Rutas públicas
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Rutas protegidas (admin)
router.post('/', authenticateToken, authorizeRole('admin'), validateService, serviceController.createService);
router.put('/:id', authenticateToken, authorizeRole('admin'), validateService, serviceController.updateService);
router.delete('/:id', authenticateToken, authorizeRole('admin'), serviceController.deleteService);

module.exports = router;