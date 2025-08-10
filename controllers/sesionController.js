const Sesion = require('../models/Sesion');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');

// Crear sesión
const createSession = async (req, res) => {
  try {
    const sessionData = req.body;

    // Verificar que el paciente existe
    const patient = await Paciente.findById(sessionData.paciente_id);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar que el profesional existe
    const professional = await Profesional.findById(sessionData.profesional_id);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    // Verificar permisos: solo profesionales pueden crear sesiones
    if (req.user.rol !== 'profesional') {
      return res.status(403).json({
        error: 'Solo los profesionales pueden crear sesiones'
      });
    }

    // Verificar disponibilidad de horario
    const isAvailable = await Sesion.checkAvailability(
      sessionData.profesional_id,
      sessionData.fecha_hora,
      sessionData.duracion_minutos || 50
    );

    if (!isAvailable) {
      return res.status(400).json({
        error: 'El horario seleccionado no está disponible'
      });
    }

    const newSession = await Sesion.create(sessionData);

    res.status(201).json({
      message: 'Sesión creada exitosamente',
      sesion: newSession
    });

  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener todas las sesiones
const getAllSessions = async (req, res) => {
  try {
    const { 
      paciente_id, profesional_id, estado, tipo_sesion,
      fecha_desde, fecha_hasta, limit 
    } = req.query;
    
    const filters = {};
    
    // Aplicar filtros según el rol del usuario
    if (req.user.rol === 'paciente') {
      // Los pacientes solo pueden ver sus propias sesiones
      const patient = await Paciente.findByUserId(req.user.id);
      if (!patient) {
        return res.status(404).json({
          error: 'Perfil de paciente no encontrado'
        });
      }
      filters.paciente_id = patient.id;
    } else if (req.user.rol === 'profesional') {
      // Los profesionales pueden filtrar por sus pacientes
      if (profesional_id) {
        const professional = await Profesional.findByUserId(req.user.id);
        if (professional && parseInt(profesional_id) !== professional.id) {
          return res.status(403).json({
            error: 'No puedes ver sesiones de otros profesionales'
          });
        }
        filters.profesional_id = profesional_id;
      }
    }
    
    // Aplicar otros filtros
    if (paciente_id) filters.paciente_id = paciente_id;
    if (estado) filters.estado = estado;
    if (tipo_sesion) filters.tipo_sesion = tipo_sesion;
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    if (limit) filters.limit = limit;

    const sessions = await Sesion.findAll(filters);
    
    res.json({
      message: 'Sesiones obtenidas exitosamente',
      count: sessions.length,
      sesiones: sessions
    });

  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener sesión por ID
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await Sesion.findById(id);
    if (!session) {
      return res.status(404).json({
        error: 'Sesión no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'paciente') {
      const patient = await Paciente.findByUserId(req.user.id);
      if (!patient || session.paciente_id !== patient.id) {
        return res.status(403).json({
          error: 'No tienes permisos para ver esta sesión'
        });
      }
    } else if (req.user.rol === 'profesional') {
      const professional = await Profesional.findByUserId(req.user.id);
      if (!professional || session.profesional_id !== professional.id) {
        return res.status(403).json({
          error: 'No tienes permisos para ver esta sesión'
        });
      }
    }

    res.json({
      message: 'Sesión obtenida exitosamente',
      sesion: session
    });

  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar sesión
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que la sesión existe
    const existingSession = await Sesion.findById(id);
    if (!existingSession) {
      return res.status(404).json({
        error: 'Sesión no encontrada'
      });
    }

    // Verificar permisos: solo profesionales pueden actualizar sesiones
    if (req.user.rol !== 'profesional') {
      return res.status(403).json({
        error: 'Solo los profesionales pueden actualizar sesiones'
      });
    }

    const professional = await Profesional.findByUserId(req.user.id);
    if (!professional || existingSession.profesional_id !== professional.id) {
      return res.status(403).json({
        error: 'No tienes permisos para actualizar esta sesión'
      });
    }

    // Si se está cambiando la fecha/hora, verificar disponibilidad
    if (updateData.fecha_hora || updateData.duracion_minutos) {
      const fecha_hora = updateData.fecha_hora || existingSession.fecha_hora;
      const duracion = updateData.duracion_minutos || existingSession.duracion_minutos;
      
      const isAvailable = await Sesion.checkAvailability(
        existingSession.profesional_id,
        fecha_hora,
        duracion,
        id // Excluir la sesión actual de la verificación
      );

      if (!isAvailable) {
        return res.status(400).json({
          error: 'El horario seleccionado no está disponible'
        });
      }
    }

    const updatedSession = await Sesion.update(id, updateData);

    res.json({
      message: 'Sesión actualizada exitosamente',
      sesion: updatedSession
    });

  } catch (error) {
    console.error('Error actualizando sesión:', error);
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

// Eliminar sesión
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Sesion.findById(id);
    if (!session) {
      return res.status(404).json({
        error: 'Sesión no encontrada'
      });
    }

    // Verificar permisos: solo profesionales pueden eliminar sesiones
    if (req.user.rol !== 'profesional') {
      return res.status(403).json({
        error: 'Solo los profesionales pueden eliminar sesiones'
      });
    }

    const professional = await Profesional.findByUserId(req.user.id);
    if (!professional || session.profesional_id !== professional.id) {
      return res.status(403).json({
        error: 'No tienes permisos para eliminar esta sesión'
      });
    }

    await Sesion.delete(id);

    res.json({
      message: 'Sesión eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando sesión:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener sesiones próximas
const getUpcomingSessions = async (req, res) => {
  try {
    const filters = {};
    
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
      filters.profesional_id = professional.id;
    }

    const upcomingSessions = await Sesion.getUpcoming(filters);

    res.json({
      message: 'Sesiones próximas obtenidas exitosamente',
      count: upcomingSessions.length,
      sesiones: upcomingSessions
    });

  } catch (error) {
    console.error('Error obteniendo sesiones próximas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Verificar disponibilidad de horario
const checkAvailability = async (req, res) => {
  try {
    const { profesional_id, fecha_hora, duracion_minutos } = req.query;

    if (!profesional_id || !fecha_hora) {
      return res.status(400).json({
        error: 'profesional_id y fecha_hora son requeridos'
      });
    }

    const isAvailable = await Sesion.checkAvailability(
      profesional_id,
      fecha_hora,
      duracion_minutos || 50
    );

    res.json({
      message: 'Disponibilidad verificada',
      disponible: isAvailable,
      profesional_id,
      fecha_hora,
      duracion_minutos: duracion_minutos || 50
    });

  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de sesiones
const getSessionStats = async (req, res) => {
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

    const stats = await Sesion.getStats(filters);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      estadisticas: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getUpcomingSessions,
  checkAvailability,
  getSessionStats
};