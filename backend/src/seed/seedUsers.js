// backend-tpi/src/seed/seedUsers.js
const { sequelize, User } = require("../models");
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Sincronizar la base de datos
    await sequelize.sync({ force: false });

    // Eliminar usuarios existentes (opcional)
    await User.destroy({ where: {} });

    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Administrador',
      email: 'admin@rifli.com',
      password: adminPassword,
      role: 'admin'
    });

    // Crear usuario normal
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Usuario Normal',
      email: 'user@rifli.com',
      password: userPassword,
      role: 'user'
    });

    console.log('✅ Usuarios de prueba creados exitosamente:');
    console.log('Admin: email=admin@rifli.com / password=admin123');
    console.log('User: email=user@rifli.com / password=user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuarios de prueba:', error);
    process.exit(1);
  }
}

seed();