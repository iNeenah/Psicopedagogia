const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const { validateEvaluation, validateId } = require('../middlewares/validation');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Crear evaluación (solo profesionales)
router.post('/', verifyRole('profesional'), validateEvaluation, evaluacionController.createEvaluation);

// Obtener todas las evaluaciones
router.get('/', evaluacionController.getAllEvaluations);

// Obtener estadísticas de evaluaciones
router.get('/estadisticas', evaluacionController.getEvaluationStats);

// Obtener evaluaciones por paciente
router.get('/paciente/:pacienteId', validateId, evaluacionController.getEvaluationsByPatient);

// Obtener evaluaciones por profesional
router.get('/profesional/:profesionalId', validateId, evaluacionController.getEvaluationsByProfessional);

// Obtener evaluación por ID
router.get('/:id', validateId, evaluacionController.getEvaluationById);

// Actualizar evaluación (solo profesionales)
router.put('/:id', validateId, verifyRole('profesional'), validateEvaluation, evaluacionController.updateEvaluation);

// Eliminar evaluación (solo profesionales)
router.delete('/:id', validateId, verifyRole('profesional'), evaluacionController.deleteEvaluation);

module.exports = router;