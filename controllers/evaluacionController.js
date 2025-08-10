const Evaluacion = require('../models/Evaluacion');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Sesion = require('../models/Sesion');

// Crear evaluación
const createEvaluation = async (req, res) => {
  try {
    const evaluationData = req.body;

    // Verificar que el paciente existe
    const patient = await Paciente.findById(evaluationData.paciente_id);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar que el profesional existe
    const professional = await Profesional.findById(evaluationData.profesional_id);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    // Verificar permisos: solo profesionales pueden crear evaluaciones
    if (req.user.rol !== 'profesional') {
      return res.status(403).json({
        error: 'Solo los profesionales pueden crear evaluaciones'
      });
    }

    // Verificar que el profesional autenticado es el mismo que crea la evaluación
    const authenticatedProfessional = await Profesional.findByUserId(req.user.id);
    if (!authenticatedProfessional || authenticatedProfessional.id !== evaluationData.profesional_id) {
      return res.status(403).json({
        error: 'Solo puedes crear evaluaciones para ti mismo'
      });
    }

    // Si se especifica sesion_id, verificar que existe y pertenece al profesional y paciente
    if (evaluationData.sesion_id) {
      const session = await Sesion.findById(evaluationData.sesion_id);
      if (!session) {
        return res.status(404).json({
          error: 'Sesión no encontrada'
        });
      }
      
      if (session.paciente_id !== evaluationData.paciente_id || 
          session.profesional_id !== evaluationData.profesional_id) {
        return res.status(400).json({
          error: 'La sesión no corresponde al paciente y profesional especificados'
        });
      }
    }

    const newEvaluation = await Evaluacion.create(evaluationData);

    res.status(201).json({
      message: 'Evaluación creada exitosamente',
      evaluacion: newEvaluation
    });

  } catch (error) {
    console.error('Error creando evaluación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener todas las evaluaciones
const getAllEvaluations = async (req, res) => {
  try {
    const { 
      paciente_id, profesional_id, tipo_evaluacion, area_evaluada,
      fecha_desde, fecha_hasta, limit 
    } = req.query;
    
    const filters = {};
    
    // Aplicar filtros según el rol del usuario
    if (req.user.rol === 'paciente') {
      // Los pacientes solo pueden ver sus propias evaluaciones
      const patient = await Paciente.findByUserId(req.user.id);
      if (!patient) {
        return res.status(404).json({
          error: 'Perfil de paciente no encontrado'
        });
      }
      filters.paciente_id = patient.id;
    } else if (req.user.rol === 'profesional') {
      // Los profesionales pueden filtrar por sus evaluaciones
      const professional = await Profesional.findByUserId(req.user.id);
      if (!professional) {
        return res.status(404).json({
          error: 'Perfil de profesional no encontrado'
        });
      }
      
      if (profesional_id && parseInt(profesional_id) !== professional.id) {
        return res.status(403).json({
          error: 'No puedes ver evaluaciones de otros profesionales'
        });
      }
      
      filters.profesional_id = professional.id;
    }
    
    // Aplicar otros filtros
    if (paciente_id) filters.paciente_id = paciente_id;
    if (tipo_evaluacion) filters.tipo_evaluacion = tipo_evaluacion;
    if (area_evaluada) filters.area_evaluada = area_evaluada;
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    if (limit) filters.limit = limit;

    const evaluations = await Evaluacion.findAll(filters);
    
    res.json({
      message: 'Evaluaciones obtenidas exitosamente',
      count: evaluations.length,
      evaluaciones: evaluations
    });

  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener evaluación por ID
const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const evaluation = await Evaluacion.findById(id);
    if (!evaluation) {
      return res.status(404).json({
        error: 'Evaluación no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'paciente') {
      const patient = await Paciente.findByUserId(req.user.id);
      if (!patient || evaluation.paciente_id !== patient.id) {
        return res.status(403).json({
          error: 'No tienes permisos para ver esta evaluación'
        });
      }
    } else if (req.user.rol === 'profesional') {
      const professional = await Profesional.findByUserId(req.user.id);
      if (!professional || evaluation.profesional_id !== professional.id) {
        return res.status(403).json({
          error: 'No tienes permisos para ver esta evaluación'
        });
      }
    }

    res.json({
      message: 'Evaluación obtenida exitosamente',
      evaluacion: evaluation
    });

  } catch (error) {
    console.error('Error obteniendo evaluación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener evaluaciones por paciente
const getEvaluationsByPatient = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    
    const patient = await Paciente.findById(pacienteId);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'paciente' && patient.usuario_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para ver evaluaciones de otros pacientes'
      });
    }

    const evaluations = await Evaluacion.findByPatient(pacienteId);

    res.json({
      message: 'Evaluaciones del paciente obtenidas exitosamente',
      paciente_id: pacienteId,
      count: evaluations.length,
      evaluaciones: evaluations
    });

  } catch (error) {
    console.error('Error obteniendo evaluaciones del paciente:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener evaluaciones por profesional
const getEvaluationsByProfessional = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    
    const professional = await Profesional.findById(profesionalId);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    // Verificar permisos: solo el mismo profesional puede ver sus evaluaciones
    if (req.user.rol === 'profesional') {
      const authenticatedProfessional = await Profesional.findByUserId(req.user.id);
      if (!authenticatedProfessional || authenticatedProfessional.id !== parseInt(profesionalId)) {
        return res.status(403).json({
          error: 'No puedes ver evaluaciones de otros profesionales'
        });
      }
    }

    const evaluations = await Evaluacion.findByProfessional(profesionalId);

    res.json({
      message: 'Evaluaciones del profesional obtenidas exitosamente',
      profesional_id: profesionalId,
      count: evaluations.length,
      evaluaciones: evaluations
    });

  } catch (error) {
    console.error('Error obteniendo evaluaciones del profesional:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar evaluación
const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que la evaluación existe
    const existingEvaluation = await Evaluacion.findById(id);
    if (!existingEvaluation) {
      return res.status(404).json({
        error: 'Evaluación no encontrada'
      });
    }

    // Verificar permisos: solo profesionales pueden actualizar evaluaciones
    if (req.user.rol !== 'profesional') {
      return res.status(403).json({
        error: 'Solo los profesionales pueden actualizar evaluaciones'
      });
    }

    const professional = await Profesional.findByUserId(req.user.id);
    if (!professional || existingEvaluation.profesional_id !== professional.id) {
      return res.status(403).json({
        error: 'No tienes permisos para actualizar esta evaluación'
      });
    }

    const updatedEvaluation = await Evaluacion.update(id, updateData);

    res.json({
      message: 'Evaluación actualizada exitosamente',
      evaluacion: updatedEvaluation
    });

  } catch (error) {
    console.error('Error actualizando evaluación:', error);
    if (error.message === 'No hay campos para actualizar') {
      return res.status(400).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar evaluación
const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    const evaluation = await Evaluacion.findById(id);
    if (!evaluation) {
      return res.status(404).json({
        error: 'Evaluación no encontrada'
      });
    }

    // Verificar permisos: solo profesionales pueden eliminar evaluaciones
    if (req.user.rol !== 'profesional') {
      return res.status(403).json({
        error: 'Solo los profesionales pueden eliminar evaluaciones'
      });
    }

    const professional = await Profesional.findByUserId(req.user.id);
    if (!professional || evaluation.profesional_id !== professional.id) {
      return res.status(403).json({
        error: 'No tienes permisos para eliminar esta evaluación'
      });
    }

    await Evaluacion.delete(id);

    res.json({
      message: 'Evaluación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando evaluación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de evaluaciones
const getEvaluationStats = async (req, res) => {
  try {
    const { profesional_id, paciente_id, fecha_desde, fecha_hasta } = req.query;
    const filters = {};
    
    // Aplicar filtros según el rol del usuario
    if (req.user.rol === 'paciente') {
      const patient = await Paciente.findByUserId(req.user.id);
      if (!patient) {
        return res.status(404).json({
          error: 'Perfil de paciente no encontrado'
        });
      }
      filters.paciente_id = patient.id;
    } else if (req.user.rol === 'profesional') {
      const professional = await Profesional.findByUserId(req.user.id);
      if (!professional) {
        return res.status(404).json({
          error: 'Perfil de profesional no encontrado'
        });
      }
      
      if (profesional_id && parseInt(profesional_id) !== professional.id) {
        return res.status(403).json({
          error: 'No puedes ver estadísticas de otros profesionales'
        });
      }
      
      filters.profesional_id = professional.id;
    }
    
    if (paciente_id) filters.paciente_id = paciente_id;
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;

    const stats = await Evaluacion.getStats(filters);
    const areasStats = await Evaluacion.getAreasStats(filters);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      estadisticas: {
        ...stats,
        areas_evaluadas: areasStats
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  getEvaluationsByPatient,
  getEvaluationsByProfessional,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationStats
};