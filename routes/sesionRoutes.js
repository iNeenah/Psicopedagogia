const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const { validateSession, validateId } = require('../middlewares/validation');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Crear sesión (solo profesionales)
router.post('/', verifyRole('profesional'), validateSession, sesionController.createSession);

// Obtener todas las sesiones
router.get('/', sesionController.getAllSessions);

// Obtener sesiones próximas
router.get('/proximas', sesionController.getUpcomingSessions);

// Verificar disponibilidad de horario
router.get('/disponibilidad', sesionController.checkAvailability);

// Obtener estadísticas de sesiones
router.get('/estadisticas', sesionController.getSessionStats);

// Obtener sesión por ID
router.get('/:id', validateId, sesionController.getSessionById);

// Actualizar sesión (solo profesionales)
router.put('/:id', validateId, verifyRole('profesional'), validateSession, sesionController.updateSession);

// Eliminar sesión (solo profesionales)
router.delete('/:id', validateId, verifyRole('profesional'), sesionController.deleteSession);

module.exports = router;