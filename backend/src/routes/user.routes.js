const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getProfile, 
  changeRole 
} = require('../controllers/user.controller');
const { 
  authenticateToken, 
  authorizeRole 
} = require('../middlewares/authMiddleware');

// Rutas
router.get('/me', authenticateToken, getProfile);
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);
router.put('/:id/role', authenticateToken, authorizeRole('admin'), changeRole);

module.exports = router;