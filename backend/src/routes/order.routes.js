// routes/order.routes.js
import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  setShippingCost,
  uploadOrderProof,
  reviewOrderProof,
  updateOrderStatus,
  cancelOrder
} from '../controllers/order.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadPaymentProof } from '../middlewares/upload.middleware.js';
import {
  validateCreateOrder,
  validateSetShipping,
  validateReviewOrderProof,
  validateUpdateOrderStatus,
  validateGetOrders
} from '../validations/order.validations.js';
import { validateId } from '../validations/id.validation.js';

// Rutas para la gestión de órdenes
const router = express.Router();

// ========== Cliente ==========
router.post('/',                  authenticateToken,                              validateCreateOrder,      createOrder);
router.get('/',                   authenticateToken,                              validateGetOrders,        getAllOrders);
router.get('/:id',                authenticateToken, validateId,                                           getOrderById);
router.post('/:id/proof',         authenticateToken, validateId, uploadPaymentProof,                              uploadOrderProof);
router.patch('/:id/cancel',       authenticateToken, validateId,                                           cancelOrder);

// ========== Admin ==========
router.patch('/:id/shipping',     authenticateToken, authorizeRole('ADMIN'), validateId, validateSetShipping,      setShippingCost);
router.patch('/:id/proof/review', authenticateToken, authorizeRole('ADMIN'), validateId, validateReviewOrderProof, reviewOrderProof);
router.patch('/:id/status',       authenticateToken, authorizeRole('ADMIN'), validateId, validateUpdateOrderStatus, updateOrderStatus);

export default router;