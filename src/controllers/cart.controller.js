const { Cart } = require('../models');

exports.add = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const item = await Cart.create({ productId, quantity, userId });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};