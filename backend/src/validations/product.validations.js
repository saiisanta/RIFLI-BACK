import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.middleware.js';
import Product from '../models/Product.js';
import { Op } from 'sequelize';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  
  body('sku')
    .optional({ checkFalsy: true }) 
    .trim()
    .isLength({ max: 50 }).withMessage('El SKU debe tener máximo 50 caracteres')
    .custom(async (value) => {
      if (value) {
        const existing = await Product.findOne({ where: { sku: value } });
        if (existing) {
          throw new Error('El SKU ya está en uso');
        }
      }
      return true;
    }),
  
  body('short_description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción corta debe tener máximo 500 caracteres'),
  
  body('long_description')
    .optional({ checkFalsy: true })
    .trim(),
  
  body('category_id')
  .exists().withMessage('ID de categoría requerido') // 1. Verificar existencia
  .notEmpty().withMessage('ID de categoría no puede estar vacío') // 2. No vacío
  .toInt() // 3. RECIÉN AQUÍ convertimos
  .isInt({ min: 1 }).withMessage('ID de categoría inválido'), // 4. Validar el número
  
  body('brand_id')
    .notEmpty().withMessage('ID de marca requerido')
    .toInt() 
    .isInt({ min: 1 }).withMessage('ID de marca inválido'),
  
  body('price')
  .exists().withMessage('Precio requerido')
  .notEmpty().withMessage('El precio no puede estar vacío')
  .toFloat() // Convertir después de validar que existe
  .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  
  body('cost_price')
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ min: 0 }).withMessage('El precio de costo debe ser mayor o igual a 0'),
  
  body('discount_percentage')
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0 y 100'),
  
  body('stock')
  .exists().withMessage('Stock requerido')
  .notEmpty().withMessage('El stock no puede estar vacío')
  .toInt()
  .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
  
  body('min_stock')
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 0, max: 100000 }).withMessage('El stock mínimo debe estar entre 0 y 100000'),
  
  body('specifications')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!value) return true; 
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(parsed)) {
          throw new Error('Las especificaciones deben ser un array');
        }
        return true;
      } catch (e) {
        throw new Error('Las especificaciones deben ser un JSON válido');
      }
    }),
  
  body('meta_title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 60 }).withMessage('El meta título debe tener máximo 60 caracteres'),
  
  body('meta_description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 160 }).withMessage('La meta descripción debe tener máximo 160 caracteres'),
  
  body('is_active')
    .optional({ checkFalsy: true })
    .toBoolean() 
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];

export const validateProductUpdate = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  
  body('sku')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('El SKU debe tener máximo 50 caracteres')
    .custom(async (value, { req }) => {
      if (value) {
        const existing = await Product.findOne({ 
          where: { 
            sku: value,
            id: { [Op.ne]: req.params.id }
          } 
        });
        
        if (existing) {
          throw new Error('El SKU ya está en uso');
        }
      }
      return true;
    }),
  
  body('category_id')
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 1 }).withMessage('ID de categoría inválido'),
  
  body('brand_id')
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 1 }).withMessage('ID de marca inválido'),
  
  body('price')
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ min: 0.01, max: 99999999.99 }).withMessage('El precio debe estar entre 0.01 y 99999999.99'),
  
  body('cost_price')
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ min: 0 }).withMessage('El precio de costo debe ser mayor o igual a 0'),
  
  body('discount_percentage')
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0 y 100'),
  
  body('stock')
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 0, max: 100000 }).withMessage('El stock debe estar entre 0 y 100000'),
  
  body('min_stock')
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 0, max: 100000 }).withMessage('El stock mínimo debe estar entre 0 y 100000'),
  
  body('specifications')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!value) return true;
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(parsed)) {
          throw new Error('Las especificaciones deben ser un array');
        }
        return true;
      } catch (e) {
        throw new Error('Las especificaciones deben ser un JSON válido');
      }
    }),
  
  body('meta_title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 60 }).withMessage('El meta título debe tener máximo 60 caracteres'),
  
  body('meta_description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 160 }).withMessage('La meta descripción debe tener máximo 160 caracteres'),
  
  body('is_active')
    .optional({ checkFalsy: true })
    .toBoolean()
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];

