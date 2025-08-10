const Paciente = require('../models/Paciente');
const Usuario = require('../models/Usuario');

// Crear paciente
const createPatient = async (req, res) => {
  try {
    const patientData = req.body;

    // Verificar que el usuario existe y es de tipo paciente
    const user = await Usuario.findById(patientData.usuario_id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    if (user.rol !== 'paciente') {
      return res.status(400).json({
        error: 'El usuario debe tener rol de paciente'
      });
    }

    // Verificar que no existe ya un paciente para este usuario
    const existingPatient = await Paciente.findByUserId(patientData.usuario_id);
    if (existingPatient) {
      return res.status(400).json({
        error: 'Ya existe un perfil de paciente para este usuario'
      });
    }

    const newPatient = await Paciente.create(patientData);

    res.status(201).json({
      message: 'Paciente creado exitosamente',
      paciente: newPatient
    });

  } catch (error) {
    console.error('Error creando paciente:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener todos los pacientes
const getAllPatients = async (req, res) => {
  try {
    const { profesional_id, edad_min, edad_max } = req.query;
    const filters = {};
    
    // Si es un profesional, puede filtrar por sus pacientes
    if (profesional_id) {
      filters.profesional_id = profesional_id;
    }
    
    if (edad_min) {
      filters.edad_min = parseInt(edad_min);
    }
    
    if (edad_max) {
      filters.edad_max = parseInt(edad_max);
    }

    const patients = await Paciente.findAll(filters);
    
    res.json({
      message: 'Pacientes obtenidos exitosamente',
      count: patients.length,
      pacientes: patients
    });

  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener paciente por ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Paciente.findById(id);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos: pacientes solo pueden ver sus propios datos
    if (req.user.rol === 'paciente' && patient.usuario_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para ver este paciente'
      });
    }

    // Obtener estadísticas
    const stats = await Paciente.getStats(id);

    res.json({
      message: 'Paciente obtenido exitosamente',
      paciente: patient,
      estadisticas: stats
    });

  } catch (error) {
    console.error('Error obteniendo paciente:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener paciente por usuario ID
const getPatientByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const patient = await Paciente.findByUserId(userId);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'paciente' && parseInt(userId) !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para ver este paciente'
      });
    }

    res.json({
      message: 'Paciente obtenido exitosamente',
      paciente: patient
    });

  } catch (error) {
    console.error('Error obteniendo paciente:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar paciente
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el paciente existe
    const existingPatient = await Paciente.findById(id);
    if (!existingPatient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos: solo el mismo paciente o un profesional pueden actualizar
    if (req.user.rol === 'paciente' && existingPatient.usuario_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para actualizar este paciente'
      });
    }

    const updatedPatient = await Paciente.update(id, updateData);

    res.json({
      message: 'Paciente actualizado exitosamente',
      paciente: updatedPatient
    });

  } catch (error) {
    console.error('Error actualizando paciente:', error);
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

// Desactivar paciente
const deactivatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Paciente.findById(id);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    await Paciente.deactivate(id);

    res.json({
      message: 'Paciente desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error desactivando paciente:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener historial del paciente
const getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Paciente.findById(id);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'paciente' && patient.usuario_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para ver este historial'
      });
    }

    const historial = await Paciente.getHistorial(id);

    res.json({
      message: 'Historial obtenido exitosamente',
      paciente_id: id,
      historial
    });

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas del paciente
const getPatientStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Paciente.findById(id);
    if (!patient) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'paciente' && patient.usuario_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permisos para ver estas estadísticas'
      });
    }

    const stats = await Paciente.getStats(id);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      paciente_id: id,
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
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientByUserId,
  updatePatient,
  deactivatePatient,
  getPatientHistory,
  getPatientStats
};