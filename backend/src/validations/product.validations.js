import { body } from 'express-validator'
import validateFields from '../middlewares/validateFields.middleware.js';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El SKU debe tener máximo 50 caracteres')
    .custom(async (value, { req }) => {
      if (value) {
        const existing = await Product.findOne({ 
          where: { 
            sku: value,
            id: { [Op.ne]: req.params.id } // Excluir el producto actual
          } 
        });
        
        if (existing) {
          throw new Error('El SKU ya está en uso');
        }
      }
      return true;
    }),
  
  body('short_description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción corta debe tener máximo 500 caracteres'),
  
  body('long_description')
    .optional()
    .trim(),
  
  body('category_id')
    .notEmpty().withMessage('ID de categoría requerido')
    .isInt({ min: 1 }).withMessage('ID de categoría inválido'),
  
  body('brand_id')
    .notEmpty().withMessage('ID de marca requerido')
    .isInt({ min: 1 }).withMessage('ID de marca inválido'),
  
  body('price')
    .isFloat({ min: 0.01, max: 99999999.99 }).withMessage('El precio debe estar entre 0.01 y 99999999.99'),
  
  body('cost_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de costo debe ser mayor o igual a 0'),
  
  body('discount_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0 y 100'),
  
  body('stock')
    .isInt({ min: 0, max: 100000 }).withMessage('El stock debe estar entre 0 y 100000'),
  
  body('min_stock')
    .optional()
    .isInt({ min: 0, max: 100000 }).withMessage('El stock mínimo debe estar entre 0 y 100000'),
  
  body('specifications')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error('Las especificaciones deben ser un array');
        }
        return true;
      } catch (e) {
        throw new Error('Las especificaciones deben ser un JSON válido');
      }
    }),
  
  body('meta_title')
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage('El meta título debe tener máximo 60 caracteres'),
  
  body('meta_description')
    .optional()
    .trim()
    .isLength({ max: 160 }).withMessage('La meta descripción debe tener máximo 160 caracteres'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];

export const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El SKU debe tener máximo 50 caracteres'),
  
  body('short_description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción corta debe tener máximo 500 caracteres'),
  
  body('long_description')
    .optional()
    .trim(),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de categoría inválido'),
  
  body('brand_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de marca inválido'),
  
  body('price')
    .optional()
    .isFloat({ min: 0.01, max: 99999999.99 }).withMessage('El precio debe estar entre 0.01 y 99999999.99'),
  
  body('cost_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de costo debe ser mayor o igual a 0'),
  
  body('discount_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0 y 100'),
  
  body('stock')
    .optional()
    .isInt({ min: 0, max: 100000 }).withMessage('El stock debe estar entre 0 y 100000'),
  
  body('min_stock')
    .optional()
    .isInt({ min: 0, max: 100000 }).withMessage('El stock mínimo debe estar entre 0 y 100000'),
  
  body('specifications')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error('Las especificaciones deben ser un array');
        }
        return true;
      } catch (e) {
        throw new Error('Las especificaciones deben ser un JSON válido');
      }
    }),
  
  body('meta_title')
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage('El meta título debe tener máximo 60 caracteres'),
  
  body('meta_description')
    .optional()
    .trim()
    .isLength({ max: 160 }).withMessage('La meta descripción debe tener máximo 160 caracteres'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active debe ser un booleano'),
  
  validateFields
];

