const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const { validateProfessional, validateId } = require('../middlewares/validation');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Crear profesional (solo profesionales pueden crear su perfil)
router.post('/', verifyRole('profesional'), validateProfessional, profesionalController.createProfessional);

// Obtener todos los profesionales
router.get('/', profesionalController.getAllProfessionals);

// Obtener profesional por usuario ID
router.get('/user/:userId', validateId, profesionalController.getProfessionalByUserId);

// Obtener profesional por ID
router.get('/:id', validateId, profesionalController.getProfessionalById);

// Obtener horarios del profesional
router.get('/:id/horarios', validateId, profesionalController.getProfessionalSchedule);

// Obtener estadísticas del profesional
router.get('/:id/estadisticas', validateId, profesionalController.getProfessionalStats);

// Actualizar profesional
router.put('/:id', validateId, validateProfessional, profesionalController.updateProfessional);

// Desactivar profesional (solo profesionales)
router.delete('/:id', validateId, verifyRole('profesional'), profesionalController.deactivateProfessional);

module.exports = router;