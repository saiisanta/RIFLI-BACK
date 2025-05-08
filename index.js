const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./src/models'); // o donde tengas tus modelos

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas (importa las que hayas creado)
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/products', require('./src/routes/product.routes'));
app.use('/api/services', require('./src/routes/service.routes'));
app.use('/api/quotes', require('./src/routes/quote.routes'));
app.use('/api/carts', require('./src/routes/cart.routes'));

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('🔌 Base de datos conectada');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
