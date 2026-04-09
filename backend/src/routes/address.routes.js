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
import { generalLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  validateCreateAddress,
  validateUpdateAddress
} from '../validations/address.validations.js';
import { validateId } from '../validations/id.validation.js';

const router = express.Router();

// ========== Todas las rutas requieren autenticación ==========

router.get('/', authenticateToken, generalLimiter, getAllAddresses);
router.get('/default', authenticateToken, generalLimiter, getDefaultAddress);
router.get('/:id', authenticateToken, generalLimiter, validateId, getAddressById);
router.post('/', authenticateToken, generalLimiter, validateCreateAddress, createAddress);
router.put('/:id', authenticateToken, generalLimiter, validateId, validateUpdateAddress, updateAddress);
router.patch('/:id/default', authenticateToken, generalLimiter, validateId, setDefaultAddress);
router.delete('/:id', authenticateToken, generalLimiter, validateId, deleteAddress);

export default router;