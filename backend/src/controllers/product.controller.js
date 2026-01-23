// controllers/product.controller.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import sequelize from "../config/db.js";
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

export const getAllProducts = async (req, res) => {
  try {
    const { category_id, brand_id, min_price, max_price, is_active } =
      req.query;

    const where = {};
    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;
    if (is_active !== undefined) where.is_active = is_active === "true";
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "icon"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo_url"] },
      ],
      order: [["stock", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    // Incrementar contador de vistas (sin esperar)
    product
      .increment("view_count")
      .catch((err) => console.error("Error incrementando views:", err));

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();
  try {
    const category = await Category.findByPk(req.body.category_id, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(400).json({ error: "Categoría no encontrada" });
    }

    const brand = await Brand.findByPk(req.body.brand_id, { transaction });
    if (!brand) {
      await transaction.rollback();
      return res.status(400).json({ error: "Marca no encontrada" });
    }

    const images = req.files ? req.files.map((f) => `/images/products/${f.filename}`) : [];
    const mainImage = images.length > 0 ? images[0] : null;

    let specifications = null;
    if (req.body.specifications) {
      specifications = typeof req.body.specifications === "string" 
        ? JSON.parse(req.body.specifications) 
        : req.body.specifications;
    }

    const product = await Product.create({
      ...req.body,
      price: parseFloat(req.body.price),
      cost_price: req.body.cost_price ? parseFloat(req.body.cost_price) : null,
      discount_percentage: parseFloat(req.body.discount_percentage || 0),
      stock: parseInt(req.body.stock) || 0,
      min_stock: parseInt(req.body.min_stock) || 5,
      specifications,
      images: images.length > 0 ? images : null,
      main_image: mainImage,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true,
    }, { transaction });

    await transaction.commit();

    const newProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    res.status(201).json(newProduct);
  } catch (err) {
    await transaction.rollback();
    // Limpieza de emergencia: borrar fotos si la DB falló
    if (req.files && req.files.length > 0) {
      const pathsToDelete = req.files.map(f => `/images/products/${f.filename}`);
      await deleteMultipleImages(pathsToDelete);
    }
    console.error(err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Validaciones de FK (Categoría y Marca)
    if (req.body.category_id) {
      const cat = await Category.findByPk(req.body.category_id, { transaction });
      if (!cat) { await transaction.rollback(); return res.status(400).json({ error: "Categoría no encontrada" }); }
    }

    let images = [...(product.images || [])];
    let mainImage = product.main_image;
    const imagesToDeletePhysical = [];

    // 1. Agregar nuevas imágenes (Unificado a /images/products/)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/images/products/${f.filename}`);
      images = [...images, ...newImages];
      if (!mainImage) mainImage = newImages[0];
    }

    // 2. Remover imágenes solicitadas
    if (req.body.remove_images) {
      const toRemove = JSON.parse(req.body.remove_images);
      imagesToDeletePhysical.push(...toRemove);
      images = images.filter(img => !toRemove.includes(img));
      if (toRemove.includes(mainImage)) {
        mainImage = images.length > 0 ? images[0] : null;
      }
    }

    // 3. Cambiar imagen principal
    if (req.body.set_main_image && images.includes(req.body.set_main_image)) {
      mainImage = req.body.set_main_image;
    }

    await product.update({
      ...req.body,
      images: images.length > 0 ? images : null,
      main_image: mainImage,
      specifications: req.body.specifications ? JSON.parse(req.body.specifications) : product.specifications
    }, { transaction });

    await transaction.commit();

    // Solo borramos del disco tras un commit exitoso
    if (imagesToDeletePhysical.length > 0) {
      await deleteMultipleImages(imagesToDeletePhysical);
    }

    const updated = await Product.findByPk(product.id, {
      include: [{ model: Category, as: "category" }, { model: Brand, as: "brand" }]
    });
    res.json(updated);
  } catch (err) {
    await transaction.rollback();
    if (req.files) {
      const paths = req.files.map(f => `/images/products/${f.filename}`);
      await deleteMultipleImages(paths);
    }
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    // Guardar referencias a las imágenes antes de eliminar
    const imagesToDelete = product.images || [];
    
    // Eliminar el producto de la base de datos
    await product.destroy();
    
    // Eliminar todas las imágenes del sistema de archivos
    if (imagesToDelete.length > 0) {
      await deleteMultipleImages(imagesToDelete);
      console.log(`✓ Eliminadas ${imagesToDelete.length} imagen(es) del producto`);
    }
    
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

export const getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      avgPrice,
    ] = await Promise.all([
      Product.count(),
      Product.count({ where: { is_active: true } }),
      Product.count({
        where: {
          stock: {
            [Op.lt]: sequelize.col("min_stock"),
            [Op.gt]: 0,
          },
        },
      }),
      Product.count({ where: { stock: 0 } }),
      Product.sum("price", {
        where: { is_active: true },
        attributes: [
          [sequelize.fn("SUM", sequelize.literal("price * stock")), "total"],
        ],
      }),
      Product.findOne({
        attributes: [[sequelize.fn("AVG", sequelize.col("price")), "average"]],
        where: { is_active: true },
        raw: true,
      }),
    ]);

    // Top 5 productos más vendidos
    const topSelling = await Product.findAll({
      where: { is_active: true },
      order: [["sales_count", "DESC"]],
      limit: 5,
      attributes: ["id", "name", "sales_count", "stock", "price"],
    });

    // Top 5 productos más vistos
    const mostViewed = await Product.findAll({
      where: { is_active: true },
      order: [["view_count", "DESC"]],
      limit: 5,
      attributes: ["id", "name", "view_count", "stock", "price"],
    });

    res.json({
      summary: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
        low_stock: lowStockProducts,
        out_of_stock: outOfStockProducts,
        total_inventory_value: totalValue || 0,
        average_price: parseFloat(avgPrice?.average || 0).toFixed(2),
      },
      top_selling: topSelling,
      most_viewed: mostViewed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

// Busqueda avanzada
export const searchProducts = async (req, res) => {
  try {
    const {
      q, // query de búsqueda
      category_id,
      brand_id,
      min_price,
      max_price,
      in_stock, // true = solo con stock
      sort_by, // 'price_asc', 'price_desc', 'name', 'newest', 'popular'
      page = 1,
      limit = 20,
    } = req.query;

    const where = { is_active: true }; // Solo productos activos por defecto

    // Búsqueda por texto
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { short_description: { [Op.like]: `%${q}%` } },
        { long_description: { [Op.like]: `%${q}%` } },
      ];
    }

    // Filtros
    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;
    if (in_stock === "true") where.stock = { [Op.gt]: 0 };

    // Rango de precio
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    // Ordenamiento
    let order = [["name", "ASC"]]; // Por defecto

    if (sort_by === "price_asc") order = [["price", "ASC"]];
    else if (sort_by === "price_desc") order = [["price", "DESC"]];
    else if (sort_by === "newest") order = [["created_at", "DESC"]];
    else if (sort_by === "popular") order = [["sales_count", "DESC"]];
    else if (sort_by === "name") order = [["name", "ASC"]];

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "icon"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo_url"] },
      ],
      order,
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    res.json({
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al buscar productos" });
  }
};

// Productos relacionados
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscar productos de la misma categoría, excluyendo el actual
    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: id },
        is_active: true,
        stock: { [Op.gt]: 0 },
      },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo_url"] },
      ],
      limit: parseInt(limit),
      order: [["sales_count", "DESC"]], // Más vendidos primero
    });

    res.json(relatedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos relacionados" });
  }
};
