import Cart from '../models/Cart.js';

export const add = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    const item = await Cart.create({ product_id, quantity, user_id });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};