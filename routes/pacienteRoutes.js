const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const { validatePatient, validateId } = require('../middlewares/validation');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Crear paciente (pacientes pueden crear su perfil, profesionales pueden crear para otros)
router.post('/', validatePatient, pacienteController.createPatient);

// Obtener todos los pacientes (solo profesionales)
router.get('/', verifyRole('profesional'), pacienteController.getAllPatients);

// Obtener paciente por usuario ID
router.get('/user/:userId', validateId, pacienteController.getPatientByUserId);

// Obtener paciente por ID
router.get('/:id', validateId, pacienteController.getPatientById);

// Obtener historial del paciente
router.get('/:id/historial', validateId, pacienteController.getPatientHistory);

// Obtener estadísticas del paciente
router.get('/:id/estadisticas', validateId, pacienteController.getPatientStats);

// Actualizar paciente
router.put('/:id', validateId, validatePatient, pacienteController.updatePatient);

// Desactivar paciente (solo profesionales)
router.delete('/:id', validateId, verifyRole('profesional'), pacienteController.deactivatePatient);

module.exports = router;