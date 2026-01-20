import Brand from '../models/Brand.js';

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, logo_url } = req.body;
    const newBrand = await Brand.create({ name, logo_url });
    res.status(201).json(newBrand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la marca' });
  }
};