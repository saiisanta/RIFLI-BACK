import User from '../models/User.js';

// Obtener todos los usuarios (solo admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
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
export const changeRole = async (req, res) => {
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

// Eliminar usuario (requiere ser admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el usuario' });
  }
}

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json({ msg: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el perfil' });
  }
}

// Buscar usuario por id (solo admins)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el usuario' });
  }
}
