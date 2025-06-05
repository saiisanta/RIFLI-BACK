require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

const app = express();

// Add this before the error handling middleware
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the TPI API',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      services: '/api/services',
      quotes: '/api/quotes',
      carts: '/api/carts',
      users: '/api/users'
    }
  });
});


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/services', require('./routes/service.routes'));
app.use('/api/quotes', require('./routes/quote.routes'));
app.use('/api/carts', require('./routes/cart.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;

sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log('✅ Base de datos conectada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });