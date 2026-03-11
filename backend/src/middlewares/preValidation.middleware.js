import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

// Función auxiliar para eliminar archivos subidos
const cleanupUploadedFiles = async (req) => {
  try {
    // Caso 1: .fields() - Para services (req.files es un objeto)
    if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      for (const fieldName in req.files) {
        const filesArray = req.files[fieldName];
        for (const file of filesArray) {
          const filePath = path.join(process.cwd(), file.path);
          if (fsSync.existsSync(filePath)) {
            await fs.unlink(filePath);
            console.log(`Pre-validación cleanup: ${file.filename}`);
          }
        }
      }
    }
    // Caso 2: .array() - Para products (req.files es un array)
    else if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const filePath = path.join(process.cwd(), file.path);
        if (fsSync.existsSync(filePath)) {
          await fs.unlink(filePath);
          console.log(`Pre-validación cleanup: ${file.filename}`);
        }
      }
    }
    // Caso 3: .single() - Para brands, categories, avatars
    else if (req.file) {
      const filePath = path.join(process.cwd(), req.file.path);
      if (fsSync.existsSync(filePath)) {
        await fs.unlink(filePath);
        console.log(`Pre-validación cleanup: ${req.file.filename}`);
      }
    }
  } catch (error) {
    console.error('❌ Error en cleanup:', error);
  }
};

// ========== Validaciones para Products ==========
export const validateProductReferences = async (req, res, next) => {
  try {
    const { category_id, brand_id } = req.body;
    
    if (!category_id) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'category_id es requerido' });
    }
    
    const category = await Category.findByPk(category_id);
    if (!category) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'Categoría no encontrada' });
    }
    
    if (!brand_id) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'brand_id es requerido' });
    }
    
    const brand = await Brand.findByPk(brand_id);
    if (!brand) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'Marca no encontrada' });
    }
    
    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: 'Error en validación de referencias' });
  }
};

// ========== Validaciones para Categories ==========
export const validateCategoryParent = async (req, res, next) => {
  try {
    const { parent_id } = req.body;
    
    if (!parent_id) {
      return next();
    }
    
    const parentCategory = await Category.findByPk(parent_id);
    if (!parentCategory) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'Categoría padre no encontrada' });
    }
    
    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: 'Error en validación de categoría padre' });
  }
};

// ========== Validaciones para Services ==========
export const validateServiceType = async (req, res, next) => {
  try {
    const { type, name } = req.body;
    const validTypes = ['ELECTRICITY', 'SECURITY', 'GAS'];
    
    if (!type) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'El tipo de servicio es requerido' });
    }
    
    if (!validTypes.includes(type)) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ 
        error: `Tipo de servicio inválido. Debe ser: ${validTypes.join(', ')}` 
      });
    }
    
    if (!name || name.trim().length === 0) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'El nombre del servicio es requerido' });
    }
    
    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: 'Error en validación de servicio' });
  }
};

// ========== Validaciones para Brands ==========
export const validateBrandName = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: 'El nombre de la marca es requerido' });
    }
    
    if (name.length < 2 || name.length > 100) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ 
        error: 'El nombre de la marca debe tener entre 2 y 100 caracteres' 
      });
    }
    
    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: 'Error en validación de marca' });
  }
};