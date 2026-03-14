// routes/address.routes.js
import express from 'express';
import {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getDefaultAddress
} from '../controllers/address.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  validateCreateAddress,
  validateUpdateAddress
} from '../validations/address.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Todas las rutas requieren autenticación ==========

// Obtener todas las direcciones del usuario autenticado
router.get('/', authenticateToken, getAllAddresses);

// Obtener dirección por defecto
router.get('/default', authenticateToken, getDefaultAddress);

// Obtener dirección por ID
router.get('/:id', authenticateToken, validateId, getAddressById);

// Crear nueva dirección
router.post('/', authenticateToken, validateCreateAddress, createAddress);

// Actualizar dirección
router.put('/:id', authenticateToken, validateId, validateUpdateAddress, updateAddress);

// Establecer dirección por defecto
router.patch('/:id/default', authenticateToken, validateId, setDefaultAddress);

// Eliminar dirección (soft delete)
router.delete('/:id', authenticateToken, validateId, deleteAddress);

export default router;