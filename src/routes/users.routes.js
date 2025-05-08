const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { register, login } = require('../controllers/auth.controller');

const {
  validateUser,
  validateLogin
} = require('../middlewares/validators');
const handleValidation = require('../middlewares/handleValidation');
const authMiddleware = require('../middlewares/auth');

// 🔐 Registro
router.post('/register', validateUser, handleValidation, register);

// 🔐 Login
router.post('/login', validateLogin, handleValidation, login);

// 🔒 Obtener todos los usuarios (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// 🔒 Obtener un usuario por ID (protegido)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});

// 🔒 Actualizar un usuario (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

// 🔒 Eliminar un usuario (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
