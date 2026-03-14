<<<<<<< HEAD
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import Service from '../models/Service.js';
import Address from '../models/Address.js';
=======
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
>>>>>>> ffb1717d229577c6947be530eb863db3252dab63

// Función auxiliar para eliminar archivos subidos
const cleanupUploadedFiles = async (req) => {
  try {
    // Caso 1: .fields() - Para services (req.files es un objeto)
    if (
      req.files &&
      typeof req.files === "object" &&
      !Array.isArray(req.files)
    ) {
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
    console.error("❌ Error en cleanup:", error);
  }
};

// ========== Validaciones para Products ==========
export const validateProductReferences = async (req, res, next) => {
  try {
    const { category_id, brand_id } = req.body;

    if (!category_id) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: "category_id es requerido" });
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: "Categoría no encontrada" });
    }

    if (!brand_id) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: "brand_id es requerido" });
    }

    const brand = await Brand.findByPk(brand_id);
    if (!brand) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({ error: "Marca no encontrada" });
    }

    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: "Error en validación de referencias" });
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
      return res.status(400).json({ error: "Categoría padre no encontrada" });
    }

    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: "Error en validación de categoría padre" });
  }
};

// ========== Validaciones para Services ==========
export const validateServiceBasics = async (req, res, next) => {
  try {
    const { type, features, form_schema } = req.body;

    const isUpdate = req.method === "PUT" || req.method === "PATCH";

    // 1. Validar presencia solo si NO es update
    if (!isUpdate && (!type || type.trim().length === 0)) {
      await cleanupUploadedFiles(req);
      return res
        .status(400)
        .json({ error: "El tipo de servicio es requerido" });
    }

    // 2. Validar largo SOLO SI viene el type (en create o en update opcional)
    if (type && type.trim().length > 100) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({
        error: "El tipo de servicio no puede exceder 100 caracteres",
      });
    }

    // Validar features si existe
    if (features) {
      try {
        let parsedFeatures = features;
        if (typeof features === "string") {
          parsedFeatures = JSON.parse(features);
        }

        if (!Array.isArray(parsedFeatures)) {
          await cleanupUploadedFiles(req);
          return res.status(400).json({ error: "Features debe ser un array" });
        }

        if (!parsedFeatures.every((item) => typeof item === "string")) {
          await cleanupUploadedFiles(req);
          return res.status(400).json({
            error: "Todos los elementos de features deben ser strings",
          });
        }
      } catch (e) {
        await cleanupUploadedFiles(req);
        return res
          .status(400)
          .json({ error: "Features debe ser un JSON válido" });
      }
    }

    // Validar form_schema si existe
    if (form_schema) {
      try {
        let schema = form_schema;
        if (typeof form_schema === "string") {
          schema = JSON.parse(form_schema);
        }

        if (!schema.fields || !Array.isArray(schema.fields)) {
          await cleanupUploadedFiles(req);
          return res.status(400).json({
            error: 'form_schema debe contener un array "fields"',
          });
        }

        // Validar estructura básica de cada field
        for (let i = 0; i < schema.fields.length; i++) {
          const field = schema.fields[i];

          if (!field.id || typeof field.id !== "string") {
            await cleanupUploadedFiles(req);
            return res.status(400).json({
              error: `Campo ${i}: "id" es requerido y debe ser string`,
            });
          }

          if (!field.type || typeof field.type !== "string") {
            await cleanupUploadedFiles(req);
            return res.status(400).json({
              error: `Campo ${i}: "type" es requerido y debe ser string`,
            });
          }

          const validTypes = [
            "text",
            "email",
            "tel",
            "textarea",
            "number",
            "select",
            "radio",
            "checkbox",
            "date",
            "file",
            "array",
          ];
          if (!validTypes.includes(field.type)) {
            await cleanupUploadedFiles(req);
            return res.status(400).json({
              error: `Campo ${i}: tipo "${field.type}" no es válido. Tipos permitidos: ${validTypes.join(", ")}`,
            });
          }

          if (!field.label || typeof field.label !== "string") {
            await cleanupUploadedFiles(req);
            return res.status(400).json({
              error: `Campo ${i}: "label" es requerido y debe ser string`,
            });
          }

          if (
            field.comment !== undefined &&
            typeof field.comment !== "string"
          ) {
            await cleanupUploadedFiles(req);
            return res.status(400).json({
              error: `Campo ${i}: "comment" debe ser string si se proporciona`,
            });
          }
          // Validar que select y radio tengan options
          if (field.type === "select" || field.type === "radio") {
            if (
              !field.options ||
              !Array.isArray(field.options) ||
              field.options.length === 0
            ) {
              await cleanupUploadedFiles(req);
              return res.status(400).json({
                error: `Campo ${i}: campos de tipo "${field.type}" deben tener un array "options" con al menos un elemento`,
              });
            }
          }

          // Validar que array tenga itemSchema
          if (field.type === "array" && field.itemSchema !== undefined) {
            if (!Array.isArray(field.itemSchema)) {
              await cleanupUploadedFiles(req);
              return res.status(400).json({
                error: `Campo ${i}: "itemSchema" debe ser un array`,
              });
            }
          }
        }
      } catch (e) {
        await cleanupUploadedFiles(req);
        return res.status(400).json({
          error: "form_schema debe ser un JSON válido: " + e.message,
        });
      }
    }

    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: "Error en validación de servicio" });
  }
};

// ========== Validaciones para Brands ==========
export const validateBrandName = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      await cleanupUploadedFiles(req);
      return res
        .status(400)
        .json({ error: "El nombre de la marca es requerido" });
    }

    if (name.length < 2 || name.length > 100) {
      await cleanupUploadedFiles(req);
      return res.status(400).json({
        error: "El nombre de la marca debe tener entre 2 y 100 caracteres",
      });
    }

    next();
  } catch (error) {
    await cleanupUploadedFiles(req);
    console.error(error);
    res.status(500).json({ error: "Error en validación de marca" });
  }
};

// ========== Validaciones para Quotes ==========
export const validateQuoteReferences = async (req, res, next) => {
  try {
    const { service_id, address_id } = req.body;
    
    // Validar service_id
    if (!service_id) {
      return res.status(400).json({ error: 'service_id es requerido' });
    }
    
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(400).json({ error: 'Servicio no encontrado' });
    }
    
    if (!service.is_active) {
      return res.status(400).json({ error: 'El servicio no está activo' });
    }
    
    // Validar address_id
    if (!address_id) {
      return res.status(400).json({ error: 'address_id es requerido' });
    }
    
    const address = await Address.findOne({
      where: {
        id: address_id,
        user_id: req.user.id  // Solo puede usar sus propias direcciones
      }
    });
    
    if (!address) {
      return res.status(400).json({ 
        error: 'Dirección no encontrada o no autorizada' 
      });
    }
    
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en validación de referencias' });
  }
};
