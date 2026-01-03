import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Recrear __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

import { sequelize } from './models/index.js';

// Importar Rutas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import serviceRoutes from './routes/service.routes.js';
import quoteRoutes from './routes/quote.routes.js';
import cartRoutes from './routes/cart.routes.js';
import userRoutes from './routes/user.routes.js';

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
      images: '/api/images'
    }
  });
});

// Middlewares
app.use(cors());
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
app.use(
  "/api/images",
  express.static(path.join(__dirname, "..", "public", "images"))
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 4001;

sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log('✅ Base de datos conectada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos:', err);
  });