// routes/order.routes.js
import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  setShippingCost,
  confirmShipping,
  uploadOrderProof,
  reviewOrderProof,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import { uploadPaymentProof } from "../middlewares/upload.middleware.js";
import { generalLimiter, orderLimiter, uploadLimiter, resendAdminLimiter} from "../middlewares/rateLimit.middleware.js";
import {
  validateCreateOrder,
  validateSetShipping,
  validateConfirmShipping,
  validateReviewOrderProof,
  validateUpdateOrderStatus,
  validateGetOrders,
} from "../validations/order.validations.js";
import { validateId } from "../validations/id.validation.js";

const router = express.Router();

// ========== Cliente ==========
router.post("/", authenticateToken, orderLimiter, validateCreateOrder, createOrder);
router.get("/", authenticateToken, generalLimiter, validateGetOrders, getAllOrders);
router.get("/:id", authenticateToken, generalLimiter, validateId, getOrderById);
router.patch("/:id/shipping/confirm", authenticateToken, generalLimiter, validateId, validateConfirmShipping, confirmShipping);
router.post("/:id/proof", authenticateToken, uploadLimiter, validateId, uploadPaymentProof, uploadOrderProof);
router.patch("/:id/cancel", authenticateToken, generalLimiter, validateId, cancelOrder);

// ========== Admin ==========
router.patch("/:id/shipping", authenticateToken, authorizeRole("ADMIN"), resendAdminLimiter, validateId, validateSetShipping, setShippingCost);
router.patch("/:id/proof/review", authenticateToken, authorizeRole("ADMIN"), resendAdminLimiter, validateId, validateReviewOrderProof, reviewOrderProof);
router.patch("/:id/status", authenticateToken, authorizeRole("ADMIN"), resendAdminLimiter, validateId, validateUpdateOrderStatus, updateOrderStatus);

export default router;
