import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Para tokens de reseteo
import { validationResult } from 'express-validator';
import { sendPasswordResetEmail } from '../services/email.service.js';
import { Op } from 'sequelize';

// Obtener todos los usuarios (solo admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']] // Más recientes primero
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verificationToken', 'verificationTokenExpires', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// Buscar usuario por id (solo admins) - SÍ ES ÚTIL
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { name, email } = req.body;

    // Verificar si el nuevo email ya existe (y no es el mismo usuario)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ 
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// Cambiar rol de usuario (requiere ser admin)
export const changeRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { role } = req.body;

    // No permitir que un admin cambie su propio rol
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No podés cambiar tu propio rol' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.role = role;
    await user.save();

    res.json({ 
      message: 'Rol actualizado correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el rol' });
  }
};

// Eliminar usuario (requiere ser admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir que un admin se elimine a sí mismo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No podés eliminar tu propia cuenta' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// ============ NUEVOS CONTROLADORES ============

// Cambiar contraseña (usuario autenticado)
export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const validPass = await bcrypt.compare(currentPassword, user.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};

// Solicitar reset de contraseña (envía email con token)
export const requestPasswordReset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user;
  try {
    const { email } = req.body;
    user = await User.findOne({ where: { email } }); // ← Asignar sin 'const'

    // Por seguridad, siempre devolver el mismo mensaje
    if (!user) {
      return res.json({ 
        message: 'Si el email existe, recibirás un enlace de recuperación' 
      });
    }

    // Generar token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Guardar en DB
    const expirationTime = Date.now() + (1 * 60 * 60 * 1000);
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = expirationTime; 
    await user.save();

    // Enviar email
    await sendPasswordResetEmail({
      to: email,
      resetToken: resetToken
    });

    res.json({ 
      message: 'Si el email existe, recibirás un enlace de recuperación' 
    });
  } catch (error) {
    console.error(error);
    
    // Ahora 'user' está disponible acá
    if (user) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
    }
    
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Resetear contraseña con token
export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hashear el token
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Token inválido o expirado. Solicitá uno nuevo.' 
      });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};

// Eliminar propia cuenta (usuario autenticado)
export const deleteOwnAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña antes de eliminar
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    await user.destroy();

    // Limpiar cookie
    res.clearCookie('token');
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cuenta' });
  }
};