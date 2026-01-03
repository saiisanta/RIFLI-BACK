const { User } = require('../models');

// Obtener todos los usuarios (solo admins)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el perfil' });
  }
};

// Cambiar rol de usuario (requiere ser admin)
exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.role = role;
    await user.save();
    res.json({ msg: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al cambiar el rol' });
  }
};