const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validaciones para usuarios
const validateUserRegistration = [
  body('email')
    .isEmail()
    .withMessage('Email debe tener un formato válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone('es-AR')
    .withMessage('Teléfono debe tener un formato válido'),
  body('rol')
    .isIn(['profesional', 'paciente'])
    .withMessage('El rol debe ser profesional o paciente'),
  handleValidationErrors
];

// Validaciones para login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email debe tener un formato válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

// Validaciones para profesionales
const validateProfessional = [
  body('matricula')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('La matrícula debe tener entre 3 y 20 caracteres'),
  body('especialidad')
    .isIn(['psicologo', 'psicopedagogo', 'ambos'])
    .withMessage('La especialidad debe ser psicologo, psicopedagogo o ambos'),
  body('anos_experiencia')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Los años de experiencia deben ser un número entre 0 y 50'),
  body('tarifa_sesion')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La tarifa debe ser un número positivo'),
  handleValidationErrors
];

// Validaciones para pacientes
const validatePatient = [
  body('fecha_nacimiento')
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),
  body('motivo_consulta')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('El motivo de consulta debe tener entre 10 y 500 caracteres'),
  body('derivado_por')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Derivado por no puede exceder 100 caracteres'),
  handleValidationErrors
];

// Validaciones para sesiones
const validateSession = [
  body('paciente_id')
    .isInt({ min: 1 })
    .withMessage('ID de paciente debe ser un número válido'),
  body('profesional_id')
    .isInt({ min: 1 })
    .withMessage('ID de profesional debe ser un número válido'),
  body('fecha_hora')
    .isISO8601()
    .withMessage('La fecha y hora debe tener formato válido'),
  body('tipo_sesion')
    .isIn(['evaluacion', 'tratamiento', 'seguimiento', 'interconsulta'])
    .withMessage('Tipo de sesión inválido'),
  body('duracion_minutos')
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage('La duración debe estar entre 15 y 180 minutos'),
  handleValidationErrors
];

// Validaciones para evaluaciones
const validateEvaluation = [
  body('paciente_id')
    .isInt({ min: 1 })
    .withMessage('ID de paciente debe ser un número válido'),
  body('profesional_id')
    .isInt({ min: 1 })
    .withMessage('ID de profesional debe ser un número válido'),
  body('fecha_evaluacion')
    .isDate()
    .withMessage('La fecha de evaluación debe ser válida'),
  body('tipo_evaluacion')
    .isIn(['inicial', 'seguimiento', 'final', 'neuropsicologica', 'psicopedagogica'])
    .withMessage('Tipo de evaluación inválido'),
  body('resultados')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Los resultados deben tener al menos 10 caracteres'),
  handleValidationErrors
];

// Validación de parámetros ID
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID debe ser un número válido'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateLogin,
  validateProfessional,
  validatePatient,
  validateSession,
  validateEvaluation,
  validateId,
  handleValidationErrors
};