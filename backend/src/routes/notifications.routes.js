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

const router = express.Router();

// ========== Rutas del usuario autenticado ==========
router.get('/',             authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/read-all',   authenticateToken, markAllAsRead);
router.patch('/:id/read',   authenticateToken, validateId, markAsRead);
router.delete('/:id',       authenticateToken, validateId, deleteNotification);

export default router;