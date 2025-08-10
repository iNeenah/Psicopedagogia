const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const { 
  validateUserRegistration, 
  validateLogin,
  handleValidationErrors 
} = require('../middlewares/validation');
const { body } = require('express-validator');

// Validación para cambio de contraseña
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

// Rutas públicas
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Rutas protegidas
router.get('/profile', verifyToken, authController.getProfile);
router.post('/change-password', verifyToken, validatePasswordChange, authController.changePassword);
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;