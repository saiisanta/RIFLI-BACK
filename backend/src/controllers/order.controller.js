// controllers/order.controller.js
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Address from '../models/Address.js';
import PaymentOrderProof from '../models/PaymentOrderProof.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import {
  notifyOrderStatusChange,
  notifyAdminNewOrder,
  notifyAdminProofUploaded,
  notifyOrderShippingQuoted
} from '../services/notifications.service.js';

const deleteFile = async (filePath) => {
  if (!filePath) return;
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fsSync.existsSync(fullPath)) await fs.unlink(fullPath);
  } catch (err) {
    console.error('Error al eliminar archivo:', err);
  }
};

// ========== 1. CREAR ORDEN DESDE CARRITO ==========
export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();

  try {
    const { address_id, payment_method, customer_notes } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true },
      transaction
    });

    if (!cart || !cart.items?.length) {
      await transaction.rollback();
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Si el cliente no manda address_id, usar la default
    let resolvedAddressId = address_id;

    if (!resolvedAddressId) {
      const defaultAddress = await Address.findOne({
        where: { user_id: req.user.id, is_default: true, is_active: true },
        transaction
      });

      if (!defaultAddress) {
        await transaction.rollback();
        return res.status(400).json({ error: 'No tenés una dirección de envío seleccionada' });
      }

      resolvedAddressId = defaultAddress.id;
    }

    const address = await Address.findOne({
      where: { id: resolvedAddressId, user_id: req.user.id, is_active: true },
      transaction
    });

    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    // Validar disponibilidad de productos y armar snapshot
    // El stock NO se descuenta aquí, se descuenta al aprobar el pago
    const itemsSnapshot = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, { transaction });

      if (!product || !product.is_active) {
        await transaction.rollback();
        return res.status(400).json({
          error: `El producto "${item.name}" ya no está disponible`
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
        });
      }

      const currentPrice = Number(product.price);
      const itemSubtotal = currentPrice * item.quantity;
      subtotal += itemSubtotal;

      itemsSnapshot.push({
        productId: product.id,
        name: product.name,
        sku: product.sku || null,
        quantity: item.quantity,
        unit_price: currentPrice,
        subtotal: itemSubtotal,
        imageUrl: item.imageUrl || null
      });
    }

    // Snapshot de dirección para preservar datos históricos
    const addressSnapshot = {
      street:      address.street,
      number:      address.number,
      city:        address.city,
      province:    address.province,
      postal_code: address.postal_code,
      country:     address.country || 'Argentina'
    };

    const order = await Order.create({
      user_id:                   req.user.id,
      address_id,
      items:                     itemsSnapshot,
      subtotal,
      shipping_cost:             null,  // pendiente de cotización
      tax:                       0,
      discount:                  0,
      total:                     subtotal, // se actualiza cuando se cotiza el envío
      currency:                  'ARS',
      payment_method,
      payment_status:            'PENDING_PROOF',
      status:                    'PENDING_PAYMENT',
      shipping_status:           'PENDING',
      shipping_address_snapshot: addressSnapshot,
      customer_notes:            customer_notes || null
    }, { transaction });

    // Vaciar carrito
    await cart.update({ items: [], subtotal: 0 }, { transaction });

    await transaction.commit();

    const orderWithRelations = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Address, as: 'shippingAddress' }
      ]
    });

    // Notificar al admin por notificación + email
    notifyAdminNewOrder(orderWithRelations).catch(console.error);

    res.status(201).json(orderWithRelations);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

// ========== 2. OBTENER TODAS LAS ÓRDENES ==========
export const getAllOrders = async (req, res) => {
  try {
    const {
      status, payment_status, shipping_status,
      from_date, to_date, page = 1, limit = 20
    } = req.query;

    const where = {};
    if (req.user.role === 'CLIENT') where.user_id = req.user.id;
    if (status)          where.status          = status;
    if (payment_status)  where.payment_status  = payment_status;
    if (shipping_status) where.shipping_status = shipping_status;

    if (from_date || to_date) {
      where.createdAt = {};
      if (from_date) where.createdAt[Op.gte] = new Date(from_date);
      if (to_date)   where.createdAt[Op.lte] = new Date(to_date);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Address, as: 'shippingAddress' }
      ],
      order: [['createdAt', 'DESC']],
      limit:    Number(limit),
      offset,
      distinct: true
    });

    res.json({
      orders,
      pagination: {
        total:       count,
        total_pages: Math.ceil(count / Number(limit)),
        page:        Number(page),
        limit:       Number(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

// ========== 3. OBTENER ORDEN POR ID ==========
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: { exclude: ['password'] } },
        { model: Address, as: 'shippingAddress' },
        { model: PaymentOrderProof, as: 'paymentOrderProofs' }
      ]
    });

    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    if (req.user.role === 'CLIENT' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

// ========== 4. ADMIN COTIZA EL ENVÍO ==========
export const setShippingCost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { shipping_cost, internal_notes } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    if (order.shipping_status !== 'PENDING') {
      return res.status(400).json({ error: 'El envío ya fue cotizado' });
    }

    const newTotal = Number(order.subtotal) + Number(shipping_cost);

    await order.update({
      shipping_cost,
      total:           newTotal,
      shipping_status: 'QUOTED',
      ...(internal_notes && { internal_notes })
    });

    notifyOrderShippingQuoted(order).catch(console.error);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al setear costo de envío' });
  }
};

// ========== 5. CLIENTE SUBE COMPROBANTE ==========
export const uploadOrderProof = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se proporcionó archivo' });

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (order.user_id !== req.user.id) {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (order.shipping_status === 'PENDING') {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
      return res.status(400).json({
        error: 'El costo de envío aún no fue calculado. Aguardá la notificación.'
      });
    }

    const {
      payment_type, amount, transaction_reference,
      transaction_date, bank_name, notes
    } = req.body;

    const proof = await PaymentOrderProof.create({
      order_id:              order.id,
      user_id:               req.user.id,
      payment_type,
      amount,
      proof_image_url:       `/uploads/proofs/${req.file.filename}`,
      transaction_reference: transaction_reference || null,
      transaction_date:      transaction_date      || null,
      bank_name:             bank_name             || null,
      notes:                 notes                 || null,
      status:                'PENDING'
    });

    await order.update({ payment_status: 'PROOF_UPLOADED' });

    notifyAdminProofUploaded(order).catch(console.error);

    res.json({ message: 'Comprobante subido correctamente', proof });
  } catch (err) {
    if (req.file) await deleteFile(`/uploads/proofs/${req.file.filename}`);
    console.error(err);
    res.status(500).json({ error: 'Error al subir comprobante' });
  }
};

// ========== 6. ADMIN APRUEBA O RECHAZA COMPROBANTE ==========
export const reviewOrderProof = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();

  try {
    const { proof_id, action, admin_notes, rejection_reason } = req.body;

    const order = await Order.findByPk(req.params.id, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const proof = await PaymentOrderProof.findOne({
      where: { id: proof_id, order_id: order.id },
      transaction
    });
    if (!proof) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Comprobante no encontrado' });
    }

    if (action === 'approve') {
      // ✅ Descontar stock recién aquí
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction });

        if (!product) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Producto "${item.name}" no encontrado al intentar descontar stock`
          });
        }

        if (product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
          });
        }

        await product.update(
          { stock: product.stock - item.quantity,
            sales_count: product.sales_count + item.quantity
          },
          
          { transaction }
        );
      }

      await proof.update({
        status:      'APPROVED',
        reviewed_by: req.user.id,
        reviewed_at: new Date(),
        admin_notes: admin_notes || null
      }, { transaction });

      await order.update({
        payment_status: 'APPROVED',
        status:         'PROCESSING',  // pago aprobado → preparando
        paid_at:        new Date()
      }, { transaction });

    } else {
      await proof.update({
        status:           'REJECTED',
        reviewed_by:      req.user.id,
        reviewed_at:      new Date(),
        rejection_reason: rejection_reason || null,
        admin_notes:      admin_notes      || null
      }, { transaction });

      await order.update({ payment_status: 'REJECTED' }, { transaction });
    }

    await transaction.commit();

    notifyOrderStatusChange(order).catch(console.error);

    res.json(order);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al revisar comprobante' });
  }
};

// ========== 7. ADMIN ACTUALIZA ESTADO ==========
export const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { status, tracking_number, internal_notes, cancellation_reason } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    const updates = { status };

    if (status === 'SHIPPED') {
      updates.shipped_at      = new Date();
      updates.tracking_number = tracking_number || null;
    }
    if (status === 'DELIVERED')  updates.delivered_at       = new Date();
    if (status === 'CANCELLED') {
      updates.cancelled_at        = new Date();
      updates.cancellation_reason = cancellation_reason || null;
    }
    if (internal_notes) updates.internal_notes = internal_notes;

    await order.update(updates);

    notifyOrderStatusChange(order).catch(console.error);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// ========== 8. CLIENTE CANCELA ORDEN ==========
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Solo cancelable antes de que el pago sea aprobado
    if (!['PENDING_PAYMENT'].includes(order.status)) {
      return res.status(400).json({
        error: 'No podés cancelar una orden que ya está en proceso'
      });
    }

    await order.update({
      status:              'CANCELLED',
      cancelled_at:        new Date(),
      cancellation_reason: req.body.cancellation_reason || 'Cancelado por el cliente'
    });

    // Stock no se repone porque nunca fue descontado
    notifyOrderStatusChange(order).catch(console.error);

    res.json({ message: 'Orden cancelada correctamente', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cancelar la orden' });
  }
};