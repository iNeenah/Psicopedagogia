const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, verifyRole, verifyOwnership } = require('../middlewares/auth');
const { validateId } = require('../middlewares/validation');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todos los usuarios (solo profesionales pueden ver todos)
router.get('/', verifyRole('profesional'), usuarioController.getAllUsers);

// Buscar usuarios
router.get('/search', verifyRole('profesional'), usuarioController.searchUsers);

// Obtener usuario por ID
router.get('/:id', validateId, verifyOwnership, usuarioController.getUserById);

// Actualizar usuario
router.put('/:id', validateId, verifyOwnership, usuarioController.updateUser);

// Desactivar usuario (solo profesionales)
router.delete('/:id', validateId, verifyRole('profesional'), usuarioController.deactivateUser);

module.exports = router;