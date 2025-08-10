const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario');

// Crear profesional
const createProfessional = async (req, res) => {
  try {
    const professionalData = req.body;

    // Verificar que el usuario existe y es de tipo profesional
    const user = await Usuario.findById(professionalData.usuario_id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    if (user.rol !== 'profesional') {
      return res.status(400).json({
        error: 'El usuario debe tener rol de profesional'
      });
    }

    // Verificar que no existe ya un profesional para este usuario
    const existingProfessional = await Profesional.findByUserId(professionalData.usuario_id);
    if (existingProfessional) {
      return res.status(400).json({
        error: 'Ya existe un perfil profesional para este usuario'
      });
    }

    const newProfessional = await Profesional.create(professionalData);

    res.status(201).json({
      message: 'Profesional creado exitosamente',
      profesional: newProfessional
    });

  } catch (error) {
    console.error('Error creando profesional:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'La matrícula ya está registrada'
      });
    }
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener todos los profesionales
const getAllProfessionals = async (req, res) => {
  try {
    const { especialidad } = req.query;
    const filters = {};
    
    if (especialidad) {
      filters.especialidad = especialidad;
    }

    const professionals = await Profesional.findAll(filters);
    
    res.json({
      message: 'Profesionales obtenidos exitosamente',
      count: professionals.length,
      profesionales: professionals
    });

  } catch (error) {
    console.error('Error obteniendo profesionales:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener profesional por ID
const getProfessionalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professional = await Profesional.findById(id);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    // Obtener estadísticas
    const stats = await Profesional.getStats(id);

    res.json({
      message: 'Profesional obtenido exitosamente',
      profesional: professional,
      estadisticas: stats
    });

  } catch (error) {
    console.error('Error obteniendo profesional:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener profesional por usuario ID
const getProfessionalByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const professional = await Profesional.findByUserId(userId);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    res.json({
      message: 'Profesional obtenido exitosamente',
      profesional: professional
    });

  } catch (error) {
    console.error('Error obteniendo profesional:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar profesional
const updateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el profesional existe
    const existingProfessional = await Profesional.findById(id);
    if (!existingProfessional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    // Verificar permisos: solo el mismo profesional puede actualizar sus datos
    if (req.user.rol === 'profesional' && existingProfessional.usuario_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para actualizar este profesional'
      });
    }

    const updatedProfessional = await Profesional.update(id, updateData);

    res.json({
      message: 'Profesional actualizado exitosamente',
      profesional: updatedProfessional
    });

  } catch (error) {
    console.error('Error actualizando profesional:', error);
    if (error.message === 'No hay campos para actualizar') {
      return res.status(400).json({
        error: error.message
      });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'La matrícula ya está registrada'
      });
    }
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Desactivar profesional
const deactivateProfessional = async (req, res) => {
  try {
    const { id } = req.params;

    const professional = await Profesional.findById(id);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    await Profesional.deactivate(id);

    res.json({
      message: 'Profesional desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error desactivando profesional:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener horarios disponibles del profesional
const getProfessionalSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professional = await Profesional.findById(id);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    const horarios = professional.getHorariosDisponibles();

    res.json({
      message: 'Horarios obtenidos exitosamente',
      profesional_id: id,
      horarios
    });

  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas del profesional
const getProfessionalStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professional = await Profesional.findById(id);
    if (!professional) {
      return res.status(404).json({
        error: 'Profesional no encontrado'
      });
    }

    const stats = await Profesional.getStats(id);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      profesional_id: id,
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
  createProfessional,
  getAllProfessionals,
  getProfessionalById,
  getProfessionalByUserId,
  updateProfessional,
  deactivateProfessional,
  getProfessionalSchedule,
  getProfessionalStats
};