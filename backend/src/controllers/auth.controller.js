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

const { firstName, lastName, documentType, documentNumber, email, password, phone } = req.body;
  let user;

  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const documentExists = await User.findOne({ where: { documentNumber } });
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
      firstName,
      lastName,
      documentType,
      documentNumber,
      email,
      password: hashedPassword,
      phone,
      role: 'CLIENT',
      isVerified: false, 
      verificationToken: verificationTokenHash,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    await sendVerificationEmail({
      to: email,
      verificationToken: verificationToken, 
      userName: `${firstName} ${lastName}`
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
        verificationToken: verificationTokenHash,
        verificationTokenExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Token de verificación inválido o expirado' 
      });
    }

    // Verificar usuario
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
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
    if (user.isVerified) {
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

user.verificationToken = verificationTokenHash;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail({
      to: email,
      verificationToken: verificationToken,
      userName: `${user.firstName} ${user.lastName}`
    });

    res.json({ 
      message: 'Si el email existe y no está verificado, recibirás un nuevo enlace' 
    });
  } catch (error) {
    console.error(error);
    
    if (user) {
      user.verificationToken = null;
      user.verificationTokenExpires = null;
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
    if (!user.isVerified) {
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isVerified: user.isVerified
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