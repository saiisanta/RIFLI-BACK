// controllers/category.controller.js
import Category from '../models/Category.js';
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
// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const { include_inactive, parent_id } = req.query;
    
    const where = {};
    
    // Filtrar por estado
    if (include_inactive !== 'true') {
      where.is_active = true;
    }
    
    // Filtrar por categoría padre
    if (parent_id !== undefined) {
      where.parent_id = parent_id === 'null' ? null : parent_id;
    }
    
    const categories = await Category.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'name', 'icon']
        }
      ],
      order: [['name', 'ASC']]
    });
    
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Obtener categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'name', 'icon']
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// Crear categoría
export const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, parent_id } = req.body;
    
    // Si tiene parent_id, verificar que exista
    if (parent_id) {
      const parentCategory = await Category.findByPk(parent_id);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Categoría padre no encontrada' });
      }
    }
    
    const icon = req.file ? `/images/categories/${req.file.filename}` : null;
    
    const newCategory = await Category.create({
      name,
      description: description || null,
      parent_id: parent_id || null,
      icon,
      is_active: true
    });
    
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Actualizar categoría
export const updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const category = await Category.findByPk(req.params.id, { transaction });
    
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    const { name, description, parent_id, is_active } = req.body;
    
    // Validar que no se asigne a sí misma como padre
    if (parent_id && parseInt(parent_id) === category.id) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Una categoría no puede ser su propia categoría padre' });
    }
    
    // Validar que no se cree un ciclo
    if (parent_id) {
      const parentCategory = await Category.findByPk(parent_id, { transaction });
      if (!parentCategory) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Categoría padre no encontrada' });
      }
      
      // Verificar que el padre no sea una subcategoría de esta categoría
      let current = parentCategory;
      while (current.parent_id) {
        if (current.parent_id === category.id) {
          await transaction.rollback();
          return res.status(400).json({ error: 'No se puede crear un ciclo de categorías' });
        }
        current = await Category.findByPk(current.parent_id, { transaction });
      }
    }
    
    // Manejar icono
    let icon = category.icon;
    if (req.file) {
      // Guardar referencia al icono anterior
      const oldIcon = category.icon;
      
      icon = `/images/categories/${req.file.filename}`;
      
      // Eliminar icono anterior si existe
      if (oldIcon) {
        deleteImage(oldIcon);
      }
    }
    
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      parent_id: parent_id !== undefined ? (parent_id || null) : category.parent_id,
      icon,
      is_active: is_active !== undefined ? is_active : category.is_active
    }, { transaction });
    
    await transaction.commit();
    
    const updatedCategory = await Category.findByPk(category.id, {
      include: [
        { model: Category, as: 'parent', attributes: ['id', 'name'] },
        { model: Category, as: 'subcategories', attributes: ['id', 'name'] }
      ]
    });
    
    res.json(updatedCategory);
  } catch (err) {
    await transaction.rollback();
    
    // Si hubo error y se subió una nueva imagen, eliminarla
    if (req.file) {
      deleteImage(`/images/categories/${req.file.filename}`);
    }
    
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Eliminar categoría
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    // Verificar si tiene productos asociados
    const productsCount = await category.countProducts();
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s)` 
      });
    }
    
    // Verificar si tiene subcategorías
    const subcategoriesCount = await Category.count({ where: { parent_id: category.id } });
    if (subcategoriesCount > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar la categoría porque tiene ${subcategoriesCount} subcategoría(s)` 
      });
    }
    
    // Eliminar icono si existe
    if (category.icon) {
      deleteImage(category.icon);
    }
    
    await category.destroy();
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};