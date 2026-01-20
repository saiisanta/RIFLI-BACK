import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image_url } = req.body;
    const newCategory = await Category.create({ name, logo_url });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};