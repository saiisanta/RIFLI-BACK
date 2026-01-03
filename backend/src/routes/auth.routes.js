import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../validations/auth.validations.js';

const router = express.Router();

// Rutas
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;