import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      timezone: 'Z'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true, // No deja que Sequelize cambie tus nombres a plural
      underscored: true,     // Recomendado para MySQL: usa nombres_con_guion_bajo
      timestamps: true       // Crea createdAt y updatedAt
    }
    
  }
);

// Probar conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a MySQL'))
  .catch(err => console.error('❌ Error conectando a MySQL:', err));

export default sequelize;