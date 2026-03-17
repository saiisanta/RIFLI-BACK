// controllers/notification.controller.js
import Notification from '../models/Notification.js';
import { Op } from 'sequelize';

// ========== GET NOTIFICATIONS (CLIENTE / ADMIN) ==========
// GET /api/notifications?type=QUOTE&is_read=false&page=1&limit=20
export const getNotifications = async (req, res) => {
  try {
    const {
      type,
      is_read,
      page = 1,
      limit = 20
    } = req.query;

    const where = { user_id: req.user.id };

    if (type)     where.type    = type;
    if (is_read !== undefined) where.is_read = is_read === 'true';

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit:  Number(limit),
      offset,
    });

    res.json({
      notifications,
      pagination: {
        total:       count,
        total_pages: Math.ceil(count / Number(limit)),
        page:        Number(page),
        limit:       Number(limit),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

// ========== UNREAD COUNT (para el badge del ícono 🔔) ==========
// GET /api/notifications/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { user_id: req.user.id, is_read: false }
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener conteo' });
  }
};

// ========== MARCAR UNA COMO LEÍDA ==========
// PATCH /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    if (!notification.is_read) {
      await notification.update({ is_read: true, read_at: new Date() });
    }

    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al marcar notificación' });
  }
};

// ========== MARCAR TODAS COMO LEÍDAS ==========
// PATCH /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    const where = { user_id: req.user.id, is_read: false };

    // Opcional: solo marcar un tipo específico
    if (req.query.type) where.type = req.query.type;

    const [updatedCount] = await Notification.update(
      { is_read: true, read_at: new Date() },
      { where }
    );

    res.json({ message: `${updatedCount} notificaciones marcadas como leídas` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar notificaciones' });
  }
};

// ========== ELIMINAR UNA NOTIFICACIÓN ==========
// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notification.destroy();
    res.json({ message: 'Notificación eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
};