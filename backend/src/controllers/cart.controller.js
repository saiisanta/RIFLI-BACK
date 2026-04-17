// controllers/cart.controller.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

import { getDiscountedPrice } from '../utils/price.js';

// Obtener o crear carrito del usuario
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({
    where: { user_id: userId, is_active: true },
  });
  if (!cart) {
    cart = await Cart.create({ user_id: userId, items: [], subtotal: 0 });
  }
  return cart;
};

// Recalcular subtotal desde los items
const recalculateSubtotal = (items) =>
  Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

// ========== GET CARRITO ==========
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// ========== AGREGAR PRODUCTO ==========
export const addItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ error: 'Producto no encontrado o no disponible' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${product.stock}` });
    }

    // Precio con descuento aplicado
    const finalPrice = getDiscountedPrice(product.price, product.discount_percentage);

    const cart = await getOrCreateCart(req.user.id);
    const items = [...cart.items];

    const existingIndex = items.findIndex((i) => i.product_id === product_id);

    if (existingIndex >= 0) {
      const newQuantity = items[existingIndex].quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: `Stock insuficiente. Disponible: ${product.stock}` });
      }

      items[existingIndex].quantity = newQuantity;
      items[existingIndex].subtotal = Number((finalPrice * newQuantity).toFixed(2));
    } else {
      items.push({
        product_id:          product.id,
        name:                product.name,
        sku:                 product.sku || null,
        quantity,
        original_price:      Number(product.price),        // precio sin descuento
        discount_percentage: Number(product.discount_percentage) || 0,
        price:               finalPrice,                   // precio con descuento
        subtotal:            Number((finalPrice * quantity).toFixed(2)),
        imageUrl:            product.main_image || product.images?.[0] || null,
      });
    }

    await cart.update({ items, subtotal: recalculateSubtotal(items) });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// ========== ACTUALIZAR CANTIDAD ==========
export const updateItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (quantity <= 0) return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    if (product.stock < quantity) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${product.stock}` });
    }

    const cart = await getOrCreateCart(req.user.id);

    const items = cart.items.map((item) => {
      if (item.product_id === product_id) {
        // Recalcular con el precio que ya tiene el item (ya tiene descuento)
        return {
          ...item,
          quantity,
          subtotal: item.price * quantity,
        };
      }
      return item;
    });

    await cart.update({ items, subtotal: recalculateSubtotal(items) });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// ========== ELIMINAR PRODUCTO ==========
export const removeItem = async (req, res) => {
  try {
    const { product_id } = req.params;

    const cart = await getOrCreateCart(req.user.id);
    const items = cart.items.filter((i) => i.product_id !== Number(product_id));

    await cart.update({ items, subtotal: recalculateSubtotal(items) });

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// ========== VACIAR CARRITO ==========
export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.update({ items: [], subtotal: 0 });
    res.json({ message: "Carrito vaciado", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};
