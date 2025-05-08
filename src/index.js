const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { sequelize } = require('./src/models');

const app = express();

// 🧱 Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 🚦 Rutas
const quoteRoutes = require('./src/routes/quote.routes');
const cartRoutes = require('./src/routes/cart.routes');
const productRoutes = require('./src/routes/product.routes');
const serviceRoutes = require('./src/routes/service.routes');
const userRoutes = require('./src/routes/user.routes');

app.use('/api/quotes', quoteRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// 🗃️ Conexión y sincronización de la base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos conectada y modelos sincronizados');
    app.listen(3000, () => console.log('🚀 Servidor corriendo en puerto 3000'));
  })
  .catch(err => console.error('❌ Error al conectar la base de datos:', err));
