import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import fs from 'fs';



// Recrear __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

import { 
  sequelize, 
  User, Address, Category, Brand, Product, 
  Service, Quote, Cart, Order, Notification, 
  PaymentProof 
} from './models/index.js'; 

// Importar Rutas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import serviceRoutes from './routes/service.routes.js';
import quoteRoutes from './routes/quote.routes.js';
import cartRoutes from './routes/cart.routes.js';
import userRoutes from './routes/user.routes.js';
import brandRoutes from './routes/brand.routes.js';
import categoryRoutes from './routes/category.routes.js';

const app = express();

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the TPI API',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      services: '/api/services',
      quotes: '/api/quotes',
      carts: '/api/carts',
      users: '/api/users',
      brands: '/api/brands',
      categories: '/api/categories'
    }
  });
});

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin === 'http://localhost:5173') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 4001;

const startServer = async () => {
  try {
    // 'alter: false' no modifica la estructura de la base de datos.
    await sequelize.sync({ alter: false }); 

    console.log('✅ Conexión a la base de datos establecida y verificada');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
    process.exit(1); // Cerramos el proceso si no hay DB
  }
};

startServer();