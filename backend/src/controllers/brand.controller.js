// controllers/brand.controller.js
import Brand from '../models/Brand.js';
import { validationResult } from 'express-validator';
import sequelize from '../config/db.js';
import fs from 'fs/promises'; 
import fsSync from 'fs';
import path from 'path';

// Función auxiliar para eliminar imagen
const deleteImage = async (imagePath) => {
  if (!imagePath) return;
  
  try {
    // Construir la ruta completa del archivo desde la raíz del proyecto
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    console.log('Intentando eliminar:', fullPath);
    
    // Verificar si existe antes de eliminar
    if (fsSync.existsSync(fullPath)) {
      await fs.unlink(fullPath);
      console.log('✓ Imagen eliminada correctamente');
    } else {
      console.log('⚠ Archivo no encontrado');
    }
  } catch (err) {
    console.error('✗ Error al eliminar imagen:', err);
  }
};

// Obtener todas las marcas
export const getAllBrands = async (req, res) => {
  try {
    const { include_inactive } = req.query;
    
    const where = {};
    if (include_inactive !== 'true') {
      where.is_active = true;
    }
    
    const brands = await Brand.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
};

// Obtener marca por ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    res.json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la marca' });
  }
};

// Crear marca
export const createBrand = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();
  try {
    const { name } = req.body;
    
    const logo_url = req.file ? `/images/brands/${req.file.filename}` : null;
    
    const newBrand = await Brand.create({
      name,
      logo_url,
      is_active: true
    }, { transaction });
    
    await transaction.commit();
    res.status(201).json(newBrand);
  } catch (err) {
    await transaction.rollback();
    
    // Si la DB falla, borramos la imagen que Multer ya había guardado
    if (req.file) {
      await deleteImage(`/images/brands/${req.file.filename}`);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe una marca con ese nombre' });
    }
    
    console.error(err);
    res.status(500).json({ error: 'Error al crear la marca' });
  }
};

// Actualizar marca
export const updateBrand = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();
  try {
    const brand = await Brand.findByPk(req.params.id, { transaction });
    
    if (!brand) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    const { name, is_active } = req.body;
    
    let logo_url = brand.logo_url;
    if (req.file) {
      const oldLogo = brand.logo_url;
      logo_url = `/images/brands/${req.file.filename}`;
      
      // Si la actualización es exitosa, el logo viejo se borra DESPUÉS del update
      if (oldLogo) await deleteImage(oldLogo);
    }
    
    await brand.update({
      name: name || brand.name,
      logo_url,
      is_active: is_active !== undefined ? is_active : brand.is_active
    }, { transaction });
    
    await transaction.commit();
    res.json(brand);
  } catch (err) {
    await transaction.rollback();
    
    // Si falla el update, borramos la imagen NUEVA que intentamos subir
    if (req.file) {
      await deleteImage(`/images/brands/${req.file.filename}`);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe una marca con ese nombre' });
    }
    
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la marca' });
  }
};

// Eliminar marca
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    // Verificar si tiene productos asociados
    const productsCount = await brand.countProducts();
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar la marca porque tiene ${productsCount} producto(s) asociado(s)` 
      });
    }
    
    // Eliminar logo si existe
    if (brand.logo_url) {
      deleteImage(brand.logo_url);
    }
    
    await brand.destroy();
    res.json({ message: 'Marca eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la marca' });
  }
};