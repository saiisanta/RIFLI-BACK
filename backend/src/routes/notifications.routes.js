// routes/notification.routes.js
import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notifications.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateId } from '../validations/id.validation.js';
import { validateGetNotifications } from '../validations/notifications.validations.js';
import { generalLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ========== Rutas del usuario autenticado ==========
router.get('/', generalLimiter, authenticateToken, validateGetNotifications, getNotifications);
router.get('/unread-count', generalLimiter, authenticateToken, getUnreadCount);
router.patch('/read-all', generalLimiter, authenticateToken, markAllAsRead);
router.patch('/:id/read', generalLimiter, authenticateToken, validateId, markAsRead);
router.delete('/:id', generalLimiter, authenticateToken, validateId, deleteNotification);

export default router;