// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/email.service.js';
import { Op } from 'sequelize';

// Registro con verificación de email
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); 
  }

 const { first_name, last_name, document_type, document_number, email, password, phone } = req.body;
  let user;

  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const documentExists = await User.findOne({ where: { document_number: document_number } });
    if (documentExists) {
      return res.status(400).json({ error: 'El número de documento ya está registrado' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      first_name,
      last_name,
      document_type,
      document_number,
      email,
      password: hashedPassword,
      phone,
      role: 'CLIENT',
      is_verified: false,
      verification_token: verificationTokenHash,
      verification_token_expires: Date.now() + 24 * 60 * 60 * 1000
    });

    await sendVerificationEmail({
      to: email,
      verificationToken: verificationToken,
      userName: `${first_name} ${last_name}`
    });

    res.status(201).json({ 
      message: 'Usuario creado. Por favor verificá tu email para activar tu cuenta.',
      email: email
    });
  } catch (err) {
    console.error(err);
    
    // Si falla el email eliminar el usuario creado
    if (user) {
      await user.destroy();
    }
    
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Verificar email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hashear el token para comparar con la DB
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      where: {
        verification_token: verificationTokenHash,
        verification_token_expires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Token de verificación inválido o expirado'
      });
    }

    // Verificar usuario
    user.is_verified = true;
    user.verification_token = null;
    user.verification_token_expires = null;
    await user.save();

    res.json({ 
      message: 'Email verificado correctamente. Ya podés iniciar sesión.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar el email' });
  }
};

// Reenviar email de verificación
export const resendVerification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user;

  try {
    const { email } = req.body;
    user = await User.findOne({ where: { email } });

    if (!user) {
      // Por seguridad no revelar si el email existe
      return res.json({ 
        message: 'Si el email existe y no está verificado, recibirás un nuevo enlace' 
      });
    }

    // Si ya está verificado
    if (user.is_verified) {
      return res.status(400).json({
        error: 'Este email ya está verificado'
      });
    }

    // Generar nuevo token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    user.verification_token = verificationTokenHash;
    user.verification_token_expires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail({
      to: email,
      verificationToken: verificationToken,
      userName: `${user.first_name} ${user.last_name}`
    });

    res.json({ 
      message: 'Si el email existe y no está verificado, recibirás un nuevo enlace' 
    });
  } catch (error) {
    console.error(error);
    
    if (user) {
      user.verification_token = null;
      user.verification_token_expires = null;
      await user.save();
    }
    
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Login actualizado para verificar email
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Credenciales incorrectas' });

    // Verificar que el email esté verificado
    if (!user.is_verified) {
      return res.status(403).json({
        error: 'Por favor verificá tu email antes de iniciar sesión',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout exitoso' });
};