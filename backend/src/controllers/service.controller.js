// controllers/service.controller.js
import Service from '../models/Service.js';
import { validationResult } from 'express-validator';
import sequelize from '../config/db.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

// Función auxiliar para eliminar imagen
const deleteImage = async (imagePath) => {
  if (!imagePath) return;
  
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    console.log('Intentando eliminar:', fullPath);
    
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

// Función auxiliar para eliminar múltiples imágenes
const deleteMultipleImages = async (imagePaths) => {
  if (!imagePaths || imagePaths.length === 0) return;
  
  const deletePromises = imagePaths.map(imagePath => deleteImage(imagePath));
  await Promise.all(deletePromises);
};

// Obtener todos los servicios
export const getAllServices = async (req, res) => {
  try {
    const { include_inactive, type } = req.query;
    
    const where = {};
    
    // Filtrar por estado
    if (include_inactive !== 'true') {
      where.is_active = true;
    }
    
    // Filtrar por tipo de servicio
    if (type) {
      where.type = type;
    }
    
    const services = await Service.findAll({
      where,
      order: [
        ['order', 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

// Obtener un servicio por ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar el servicio' });
  }
};

// Crear un servicio (admin)
export const createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, type, short_description, long_description, features, form_schema, is_active, order } = req.body;
    

    // Procesar las imágenes si se subieron 
    let images = null;
    let icon = null;
    
    if (req.files) {
      // Múltiples imágenes
      if (req.files.images && req.files.images.length > 0) {
        images = req.files.images.map(file => `/images/services/${file.filename}`);
      }
      
      // Un solo icono
      if (req.files.icon && req.files.icon[0]) {
        icon = `/images/services/${req.files.icon[0].filename}`;
      }
    }
    
    // Parsear features si viene como string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        return res.status(400).json({ error: 'Formato inválido de features' });
      }
    }
    
    // Parsear form_schema si viene como string
    let parsedFormSchema = form_schema;
    if (typeof form_schema === 'string') {
      try {
        parsedFormSchema = JSON.parse(form_schema);
      } catch (e) {
        return res.status(400).json({ error: 'Formato inválido de form_schema' });
      }
    }
    
    const newService = await Service.create({
      name,
      type,
      short_description: short_description || null,
      long_description: long_description || null,
      icon,
      images,  
      features: parsedFeatures || null,
      form_schema: parsedFormSchema || null,
      is_active: is_active !== undefined ? is_active : true,
      order: order || 0
    });
    
    res.status(201).json(newService);
  } catch (err) {
    // Si hubo error y se subieron imágenes, eliminarlas
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        const imagePaths = req.files.images.map(file => `/images/services/${file.filename}`);
        await deleteMultipleImages(imagePaths);
      }
      if (req.files.icon && req.files.icon[0]) {
        await deleteImage(`/images/services/${req.files.icon[0].filename}`);
      }
    }
    
    console.error(err);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

// Actualizar un servicio
export const updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const service = await Service.findByPk(req.params.id, { transaction });
    
    if (!service) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const { name, type, short_description, long_description, features, form_schema, is_active, order, remove_images } = req.body;
    
    // Manejar imágenes
    let images = service.images || [];
    let icon = service.icon;
    const imagesToDeletePhysical = [];
    
    // 1. Agregar nuevas imágenes
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        const newImages = req.files.images.map(file => `/images/services/${file.filename}`);
        images = [...images, ...newImages];
      }
      
      // Actualizar icono
      if (req.files.icon && req.files.icon[0]) {
        const oldIcon = service.icon;
        icon = `/images/services/${req.files.icon[0].filename}`;
        
        if (oldIcon) {
          await deleteImage(oldIcon);
        }
      }
    }
    
    // 2. Remover imágenes solicitadas
    if (remove_images) {
      try {
        const toRemove = JSON.parse(remove_images);
        imagesToDeletePhysical.push(...toRemove);
        images = images.filter(img => !toRemove.includes(img));
      } catch (e) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Formato inválido de remove_images' });
      }
    }
    
    // Parsear features si viene como string
    let parsedFeatures = service.features;
    if (features !== undefined) {
      if (typeof features === 'string') {
        try {
          parsedFeatures = JSON.parse(features);
        } catch (e) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Formato inválido de features' });
        }
      } else {
        parsedFeatures = features;
      }
    }
    
    // Parsear form_schema si viene como string
    let parsedFormSchema = service.form_schema;
    if (form_schema !== undefined) {
      if (typeof form_schema === 'string') {
        try {
          parsedFormSchema = JSON.parse(form_schema);
        } catch (e) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Formato inválido de form_schema' });
        }
      } else {
        parsedFormSchema = form_schema;
      }
    }
    
    await service.update({
      name: name || service.name,
      type: type || service.type,
      short_description: short_description !== undefined ? short_description : service.short_description,
      long_description: long_description !== undefined ? long_description : service.long_description,
      icon,
      images: images.length > 0 ? images : null,
      features: parsedFeatures,
      form_schema: parsedFormSchema,
      is_active: is_active !== undefined ? is_active : service.is_active,
      order: order !== undefined ? order : service.order
    }, { transaction });
    
    await transaction.commit();
    
    // Solo borramos del disco tras un commit exitoso
    if (imagesToDeletePhysical.length > 0) {
      await deleteMultipleImages(imagesToDeletePhysical);
    }
    
    res.json(service);
  } catch (err) {
    await transaction.rollback();
    
    // Si hubo error y se subieron nuevas imágenes, eliminarlas
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        const imagePaths = req.files.images.map(file => `/images/services/${file.filename}`);
        await deleteMultipleImages(imagePaths);
      }
      if (req.files.icon && req.files.icon[0]) {
        await deleteImage(`/images/services/${req.files.icon[0].filename}`);
      }
    }
    
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

// Eliminar un servicio
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Guardar referencias a las imágenes antes de eliminar
    const imagesToDelete = service.images || [];
    const iconToDelete = service.icon;
    
    await service.destroy();
    
    // Eliminar todas las imágenes
    if (imagesToDelete.length > 0) {
      await deleteMultipleImages(imagesToDelete);
    }
    if (iconToDelete) {
      await deleteImage(iconToDelete);
    }
    
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

// Reordenar servicios (útil para el admin)
export const reorderServices = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const { services } = req.body; // Array de { id, order }
    
    if (!Array.isArray(services)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Se esperaba un array de servicios' });
    }

    // Actualizar el orden de cada servicio
    const updatePromises = services.map(({ id, order }) => 
      Service.update({ order }, { 
        where: { id },
        transaction 
      })
    );

    await Promise.all(updatePromises);
    await transaction.commit();

    res.json({ message: 'Orden actualizado correctamente' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al reordenar servicios' });
  }
};