// services/notification.service.js
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendQuoteStatusEmail, sendPaymentStatusEmail, sendOrderStatusEmail } from './email.service.js';

// Mapas de traducción: status → texto de notificación 

const QUOTE_STATUS_MAP = {
  QUOTED: {
    title: '📋 Presupuesto listo para revisar',
    message: (q) => `Tu solicitud #${q.quote_number} fue cotizada por $${q.quoted_amount?.toLocaleString('es-AR')}. Entrá a revisarla y confirmá si aceptás.`,
    sendEmail: true,
  },
  ACCEPTED: {
    title: '✅ Aceptaste el presupuesto',
    message: (q) => `Confirmaste el presupuesto #${q.quote_number}. Realizá la seña para comenzar el trabajo.`,
    sendEmail: false, 
  },
  REJECTED: {
    title: '❌ Rechazaste el presupuesto',
    message: (q) => `Rechazaste el presupuesto #${q.quote_number}. Si fue un error, contactanos.`,
    sendEmail: false,
  },
  IN_PROGRESS: {
    title: '🔧 Tu trabajo comenzó',
    message: (q) => `El equipo ya inició el trabajo de tu presupuesto #${q.quote_number}.`,
    sendEmail: true,
  },
  COMPLETED: {
    title: '🎉 Trabajo completado',
    message: (q) => `El trabajo de tu presupuesto #${q.quote_number} finalizó correctamente. ¡Gracias por confiar en nosotros!`,
    sendEmail: true,
  },
  CANCELLED: {
    title: '🚫 Presupuesto cancelado',
    message: (q) => `Tu presupuesto #${q.quote_number} fue cancelado.${q.rejection_reason ? ` Motivo: ${q.rejection_reason}` : ''}`,
    sendEmail: true,
  },
};

const QUOTE_PAYMENT_MAP = {
  // Seña
  deposit: {
    PROOF_UPLOADED: {
      title: '📋 Comprobante de seña recibido',
      message: (q) => `Recibimos tu comprobante de seña del presupuesto #${q.quote_number}. Lo estamos verificando.`,
      sendEmail: false,
    },
    PAID: {
      title: '✅ Seña aprobada',
      message: (q) => `Tu seña del presupuesto #${q.quote_number} fue verificada y aprobada. El trabajo será agendado en breve.`,
      sendEmail: true,
    },
    REJECTED: {
      title: '⚠️ Comprobante de seña rechazado',
      message: (q) => `El comprobante de seña del presupuesto #${q.quote_number} fue rechazado. Por favor subí uno nuevo.`,
      sendEmail: true,
    },
  },
  // Pago final
  final: {
    PROOF_UPLOADED: {
      title: '📋 Comprobante de pago final recibido',
      message: (q) => `Recibimos tu comprobante de pago final del presupuesto #${q.quote_number}. Lo estamos verificando.`,
      sendEmail: false,
    },
    PAID: {
      title: '✅ Pago final aprobado',
      message: (q) => `Tu pago final del presupuesto #${q.quote_number} fue verificado. ¡Todo listo!`,
      sendEmail: true,
    },
    REJECTED: {
      title: '⚠️ Comprobante de pago final rechazado',
      message: (q) => `El comprobante de pago final del presupuesto #${q.quote_number} fue rechazado. Por favor subí uno nuevo.`,
      sendEmail: true,
    },
  },
};

const ORDER_STATUS_MAP = {
  PAID: {
    title: '💳 Pago confirmado',
    message: (o) => `Tu pago del pedido #${o.order_number} fue confirmado. Estamos preparando tu envío.`,
    sendEmail: true,
  },
  PROCESSING: {
    title: '📦 Preparando tu pedido',
    message: (o) => `Tu pedido #${o.order_number} está siendo preparado.`,
    sendEmail: false,
  },
  SHIPPED: {
    title: '🚚 Tu pedido fue enviado',
    message: (o) => `Tu pedido #${o.order_number} está en camino${o.tracking_number ? `. Seguimiento: ${o.tracking_number}` : ''}.`,
    sendEmail: true,
  },
  DELIVERED: {
    title: '🏠 Pedido entregado',
    message: (o) => `Tu pedido #${o.order_number} fue entregado. ¡Gracias por tu compra!`,
    sendEmail: true,
  },
  CANCELLED: {
    title: '🚫 Pedido cancelado',
    message: (o) => `Tu pedido #${o.order_number} fue cancelado.`,
    sendEmail: true,
  },
  REFUNDED: {
    title: '↩️ Reembolso procesado',
    message: (o) => `Se procesó un reembolso por tu pedido #${o.order_number}.`,
    sendEmail: true,
  },
};

// Core 

const createNotification = async ({ userId, type, title, message, metadata = {}, sendEmail = false, emailPayload = null }) => {
  const notification = await Notification.create({
    user_id: userId,
    type,
    title,
    message,
    metadata,
  });

  if (sendEmail && emailPayload) {
    try {
      await emailPayload(); // función que llama al email correspondiente
      await notification.update({ sentViaEmail: true, emailSentAt: new Date() });
    } catch (err) {
      console.error(`❌ Email fallido para notificación ${notification.id}:`, err.message);
    }
  }

  return notification;
};

// Helpers públicos 

// Cambio de estado de Quote (QUOTED, IN_PROGRESS, COMPLETED, etc.)
export const notifyQuoteStatusChange = async (quote) => {
  const config = QUOTE_STATUS_MAP[quote.status];
  if (!config) return; // estados como PENDING no notifican

  return createNotification({
    userId: quote.client_id,
    type: 'QUOTE',
    title: config.title,
    message: config.message(quote),
    metadata: {  quoteNumber: quote.quote_number, link: `/presupuestos` },
    sendEmail: config.sendEmail,
    emailPayload: config.sendEmail
      ? async () => {
          const user = await User.findByPk(quote.client_id, { attributes: ['email', 'first_name'] });
          return sendQuoteStatusEmail({ to: user.email, userName: user.first_name, quote, title: config.title, message: config.message(quote) });
        }
      : null,
  });
};

// Cambio de estado de pago de Quote (seña o final)
export const notifyQuotePaymentChange = async (quote, paymentType, newStatus) => {
  const config = QUOTE_PAYMENT_MAP[paymentType]?.[newStatus];
  if (!config) return;

  return createNotification({
    userId: quote.client_id,
    type: 'PAYMENT',
    title: config.title,
    message: config.message(quote),
    metadata: {  quoteNumber: quote.quote_number, paymentType, link: `/presupuestos` },
    sendEmail: config.sendEmail,
    emailPayload: config.sendEmail
      ? async () => {
          const user = await User.findByPk(quote.client_id, { attributes: ['email', 'first_name'] });
          return sendPaymentStatusEmail({ to: user.email, userName: user.first_name, quote, paymentType, status: newStatus });
        }
      : null,
  });
};

// Cambio de estado de Order
export const notifyOrderStatusChange = async (order) => {
  const config = ORDER_STATUS_MAP[order.status];
  if (!config) return;

  return createNotification({
    userId: order.user_id,
    type: 'ORDER',
    title: config.title,
    message: config.message(order),
    metadata: { orderId: order.id, orderNumber: order.order_number, link: `/pedidos/${order.id}` },
    sendEmail: config.sendEmail,
    emailPayload: config.sendEmail
      ? async () => {
          const user = await User.findByPk(order.user_id, { attributes: ['email', 'first_name'] });
          return sendOrderStatusEmail({ to: user.email, userName: user.first_name, order, title: config.title });
        }
      : null,
  });
};

// Verificación de cuenta (SYSTEM)
export const notifyEmailVerified = (userId) =>
  createNotification({
    userId,
    type: 'SYSTEM',
    title: '✅ Cuenta verificada',
    message: 'Tu dirección de email fue verificada correctamente. ¡Ya podés usar todas las funciones!',
    metadata: {},
  });


// Helper interno: obtener IDs de todos los admins 
const getAdminIds = async () => {
  const admins = await User.findAll({
    where: { role: 'ADMIN' },
    attributes: ['id']
  });
  return admins.map(a => a.id);
};

// Notificaciones para admins (ADMIN)
export const notifyAdminQuoteAccepted = async (quote) => {
  const adminIds = await getAdminIds();
  await Promise.all(adminIds.map(adminId =>
    createNotification({
      userId: adminId,
      type: 'ADMIN',
      title: '✅ Cliente aceptó un presupuesto',
      message: `El cliente aceptó el presupuesto #${quote.quote_number}. Aguarda el pago de la seña.`,
      metadata: {  quoteNumber: quote.quote_number, link: `/admin/presupuestos` },
    })
  ));
};

export const notifyAdminQuoteRejected = async (quote) => {
  const adminIds = await getAdminIds();
  await Promise.all(adminIds.map(adminId =>
    createNotification({
      userId: adminId,
      type: 'ADMIN',
      title: '❌ Cliente rechazó un presupuesto',
      message: `El cliente rechazó el presupuesto #${quote.quote_number}.${quote.rejection_reason ? ` Motivo: ${quote.rejection_reason}` : ''}`,
      metadata: {  quoteNumber: quote.quote_number, link: `/admin/presupuestos` },
    })
  ));
};

export const notifyAdminProofUploaded = async (quote, paymentType) => {
  const adminIds = await getAdminIds();
  const label = paymentType === 'deposit' ? 'seña' : 'pago final';
  await Promise.all(adminIds.map(adminId =>
    createNotification({
      userId: adminId,
      type: 'ADMIN',
      title: '📎 Nuevo comprobante de pago',
      message: `El cliente subió el comprobante de ${label} del presupuesto #${quote.quote_number}. Revisalo para aprobar o rechazar.`,
      metadata: {  quoteNumber: quote.quote_number, paymentType, link: `/admin/presupuestos` },
    })
  ));
};

export const notifyAdminNewQuote = async (quote) => {
  const adminIds = await getAdminIds();
  await Promise.all(adminIds.map(adminId =>
    createNotification({
      userId: adminId,
      type: 'ADMIN',
      title: '📋 Nueva solicitud de presupuesto',
      message: `Un cliente solicitó un presupuesto para "${quote.service_type}" (#${quote.quote_number}). Revisalo y enviá la cotización.`,
      metadata: {  quoteNumber: quote.quote_number, link: `/admin/presupuestos` },
    })
  ));
};