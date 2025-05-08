const { Cart } = require('../models');

const getAllCarts = async () => {
  return await Cart.findAll();
};

const getCartById = async (id) => {
  return await Cart.findByPk(id);
};

const createCartItem = async (data) => {
  return await Cart.create(data);
};

const updateCartItem = async (id, data) => {
  const cartItem = await Cart.findByPk(id);
  if (!cartItem) return null;
  return await cartItem.update(data);
};

const deleteCartItem = async (id) => {
  const cartItem = await Cart.findByPk(id);
  if (!cartItem) return null;
  await cartItem.destroy();
  return true;
};

module.exports = {
  getAllCarts,
  getCartById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
