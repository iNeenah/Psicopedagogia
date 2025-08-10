const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Profesional = require('../models/Profesional');
const Paciente = require('../models/Paciente');

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Registro de usuario
const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, rol } = req.body;

    // Verificar si el email ya existe
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const newUser = await Usuario.create({
      email, password, nombre, apellido, telefono, rol
    });

    // Generar token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: newUser.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await Usuario.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Obtener datos adicionales según el rol
    let additionalData = {};
    if (user.rol === 'profesional') {
      const profesional = await Profesional.findByUserId(user.id);
      additionalData.profesional = profesional;
    } else if (user.rol === 'paciente') {
      const paciente = await Paciente.findByUserId(user.id);
      additionalData.paciente = paciente;
    }

    // Generar token
    const token = generateToken(user.id);

    res.json({
      message: 'Login exitoso',
      token,
      user: user.toPublicJSON(),
      ...additionalData
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Obtener datos adicionales según el rol
    let additionalData = {};
    if (user.rol === 'profesional') {
      const profesional = await Profesional.findByUserId(user.id);
      additionalData.profesional = profesional;
    } else if (user.rol === 'paciente') {
      const paciente = await Paciente.findByUserId(user.id);
      additionalData.paciente = paciente;
    }

    res.json({
      user: user.toPublicJSON(),
      ...additionalData
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Obtener usuario actual
    const user = await Usuario.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await user.verifyPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'La contraseña actual es incorrecta'
      });
    }

    // Cambiar contraseña
    await Usuario.changePassword(user.id, newPassword);

    res.json({
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      valid: true,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  verifyToken
};