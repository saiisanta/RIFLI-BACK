import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Para tokens de reseteo
import { validationResult } from 'express-validator';
import { sendPasswordResetEmail } from '../services/email.service.js';
import { Op } from 'sequelize';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

// Función auxiliar para eliminar imagen
const deleteImage = async (imagePath) => {
  if (!imagePath) return;
  
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    console.log('Intentando eliminar:', fullPath);
    
    if (fsSync.existsSync(fullPath)) {
      await fs.unlink(fullPath);
      console.log('✓ Imagen eliminada correctamente');
    } else {
      console.log('⚠ Archivo no encontrado');
    }
  } catch (err) {
    console.error('✗ Error al eliminar imagen:', err);
  }
};

// Obtener todos los usuarios (solo admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'verification_token', 'verification_token_expires', 'reset_password_token', 'reset_password_expires'] },
      order: [['created_at', 'DESC']]
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
      attributes: { exclude: ['password', 'verification_token', 'verification_token_expires', 'reset_password_token', 'reset_password_expires'] }
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
      attributes: { exclude: ['password', 'verification_token', 'verification_token_expires', 'reset_password_token', 'reset_password_expires'] }
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

  const { first_name, last_name, email, phone, document_type, document_number } = req.body;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    if (document_number && document_number !== user.document_number) {
      const docExists = await User.findOne({ where: { document_number } });
      if (docExists) {
        return res.status(400).json({ error: 'El número de documento ya está en uso' });
      }
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.document_type = document_type !== undefined ? document_type : user.document_type;
    user.document_number = document_number !== undefined ? document_number : user.document_number;
    await user.save();

    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        document_type: user.document_type,
        document_number: user.document_number,
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
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        document_type: user.document_type,
        document_number: user.document_number,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el rol' });
  }
};

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
    user.reset_password_token = resetTokenHash;
    user.reset_password_expires = expirationTime;
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
      user.reset_password_token = null;
      user.reset_password_expires = null;
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
        reset_password_token: resetTokenHash,
        reset_password_expires: { [Op.gt]: Date.now() }
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
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};

// Eliminar usuario (requiere ser admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No podés eliminar tu propia cuenta' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Guardar referencia al avatar antes de eliminar
    const avatarToDelete = user.avatar_url;

    await user.destroy();

    // Eliminar avatar si existe
    if (avatarToDelete) {
      await deleteImage(avatarToDelete);
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
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

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Guardar referencia al avatar antes de eliminar
    const avatarToDelete = user.avatar_url;

    await user.destroy();

    // Eliminar avatar si existe
    if (avatarToDelete) {
      await deleteImage(avatarToDelete);
    }

    res.clearCookie('token');
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cuenta' });
  }
};

// Actualizar avatar 
export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    // Guardar referencia al avatar anterior
    const oldAvatar = user.avatar_url;

    // Asignar nuevo avatar
    const newAvatar = `/images/avatars/${req.file.filename}`;
    user.avatar_url = newAvatar;
    
    await user.save();

    // Eliminar avatar anterior si existe
    if (oldAvatar) {
      await deleteImage(oldAvatar);
    }

    res.json({
      message: 'Avatar actualizado correctamente',
      avatar_url: user.avatar_url
    });
  } catch (error) {
    // Si hubo error y se subió una imagen nueva, eliminarla
    if (req.file) {
      await deleteImage(`/images/avatars/${req.file.filename}`);
    }
    
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el avatar' });
  }
};

// Eliminar avatar 
export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Guardar referencia al avatar actual
    const currentAvatar = user.avatar_url;

    // Remover avatar
    user.avatar_url = null;
    await user.save();

    // Eliminar archivo si existe
    if (currentAvatar) {
      await deleteImage(currentAvatar);
    }

    res.json({ message: 'Avatar eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el avatar' });
  }
};