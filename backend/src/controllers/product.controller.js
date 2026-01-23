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

  //DEBUG 
  console.log("=== BACKEND DEBUG ===");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("req.files:", req.files);
  console.log("req.body:", req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const category = await Category.findByPk(req.body.category_id);
    if (!category)
      return res.status(400).json({ error: "Categoría no encontrada" });

    const brand = await Brand.findByPk(req.body.brand_id);
    if (!brand) return res.status(400).json({ error: "Marca no encontrada" });

    const images = req.files
      ? req.files.map((f) => `/images/products/${f.filename}`)
      : [];
      
    const mainImage = req.files?.[0]
      ? `/images/products/${req.files[0].filename}`
      : null;

    const specifications = req.body.specifications
      ? JSON.parse(req.body.specifications)
      : null;

    const product = await Product.create({
      name: req.body.name,
      sku: req.body.sku || null,
      short_description: req.body.short_description || null,
      long_description: req.body.long_description || null,
      category_id: req.body.category_id,
      brand_id: req.body.brand_id,
      price: parseFloat(req.body.price),
      cost_price: req.body.cost_price ? parseFloat(req.body.cost_price) : null,
      discount_percentage: req.body.discount_percentage
        ? parseFloat(req.body.discount_percentage)
        : 0,
      stock: parseInt(req.body.stock) || 0,
      min_stock: parseInt(req.body.min_stock) || 5,
      specifications,
      images: images.length > 0 ? images : null,
      main_image: mainImage,
      meta_title: req.body.meta_title || null,
      meta_description: req.body.meta_description || null,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true,
    });

    const newProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(req.params.id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Validar categoría si se proporciona
    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id, {
        transaction,
      });
      if (!category) {
        await transaction.rollback();
        return res.status(400).json({ error: "Categoría no encontrada" });
      }
    }

    // Validar marca si se proporciona
    if (req.body.brand_id) {
      const brand = await Brand.findByPk(req.body.brand_id, { transaction });
      if (!brand) {
        await transaction.rollback();
        return res.status(400).json({ error: "Marca no encontrada" });
      }
    }

    // Manejo de imágenes
    let images = product.images || [];
    let mainImage = product.main_image;
    const imagesToDelete = []; // Array para almacenar imágenes a eliminar

    // Agregar nuevas imágenes
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/images/${f.filename}`);
      images = [...images, ...newImages];

      // Si no hay imagen principal, usar la primera
      if (!mainImage && newImages.length > 0) {
        mainImage = newImages[0];
      }
    }

    // Eliminar imágenes
    if (req.body.remove_images) {
      try {
        const imagesToRemove = JSON.parse(req.body.remove_images);
        
        // Agregar las imágenes a eliminar al array
        imagesToDelete.push(...imagesToRemove);
        
        // Filtrar las imágenes del producto
        images = images.filter((img) => !imagesToRemove.includes(img));

        // Si se eliminó la imagen principal, asignar otra
        if (imagesToRemove.includes(mainImage)) {
          mainImage = images.length > 0 ? images[0] : null;
        }
      } catch (e) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Formato inválido de remove_images" });
      }
    }

    // Establecer nueva imagen principal
    if (req.body.set_main_image && images.includes(req.body.set_main_image)) {
      mainImage = req.body.set_main_image;
    }

    // Parsear specifications si viene como string
    let specifications = product.specifications;
    if (req.body.specifications) {
      try {
        specifications =
          typeof req.body.specifications === "string"
            ? JSON.parse(req.body.specifications)
            : req.body.specifications;
      } catch (e) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Formato inválido de specifications" });
      }
    }

    // Actualizar producto
    await product.update(
      {
        name: req.body.name || product.name,
        sku: req.body.sku !== undefined ? req.body.sku : product.sku,
        short_description:
          req.body.short_description !== undefined
            ? req.body.short_description
            : product.short_description,
        long_description:
          req.body.long_description !== undefined
            ? req.body.long_description
            : product.long_description,
        category_id: req.body.category_id || product.category_id,
        brand_id: req.body.brand_id || product.brand_id,
        price: req.body.price ? parseFloat(req.body.price) : product.price,
        cost_price:
          req.body.cost_price !== undefined
            ? req.body.cost_price
              ? parseFloat(req.body.cost_price)
              : null
            : product.cost_price,
        discount_percentage:
          req.body.discount_percentage !== undefined
            ? parseFloat(req.body.discount_percentage)
            : product.discount_percentage,
        stock:
          req.body.stock !== undefined
            ? parseInt(req.body.stock)
            : product.stock,
        min_stock:
          req.body.min_stock !== undefined
            ? parseInt(req.body.min_stock)
            : product.min_stock,
        specifications,
        images: images.length > 0 ? images : null,
        main_image: mainImage,
        meta_title:
          req.body.meta_title !== undefined
            ? req.body.meta_title
            : product.meta_title,
        meta_description:
          req.body.meta_description !== undefined
            ? req.body.meta_description
            : product.meta_description,
        is_active:
          req.body.is_active !== undefined
            ? req.body.is_active
            : product.is_active,
      },
      { transaction }
    );

    await transaction.commit();

    // Eliminar las imágenes del sistema de archivos DESPUÉS de hacer commit
    if (imagesToDelete.length > 0) {
      await deleteMultipleImages(imagesToDelete);
    }

    // Recargar producto con relaciones
    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "icon"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo_url"] },
      ],
    });

    res.json(updatedProduct);
  } catch (err) {
    await transaction.rollback();
    
    // Si hubo error y se subieron nuevas imágenes, eliminarlas
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/images/${f.filename}`);
      await deleteMultipleImages(newImages);
    }
    
    console.error(err);
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
