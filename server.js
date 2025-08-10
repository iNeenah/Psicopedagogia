const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeApp } = require('./config/init');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const sesionRoutes = require('./routes/sesionRoutes');
const evaluacionRoutes = require('./routes/evaluacionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/profesionales', profesionalRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/sesiones', sesionRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Clínica de Psicopedagogía y Psicología',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      profesionales: '/api/profesionales',
      pacientes: '/api/pacientes',
      sesiones: '/api/sesiones',
      evaluaciones: '/api/evaluaciones'
    }
  });
});

const PORT = process.env.PORT || 3000;

// Inicializar aplicación y servidor
const startServer = async () => {
  const initialized = await initializeApp();
  
  if (!initialized) {
    console.error('❌ No se pudo inicializar la aplicación');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`🌟 Servidor corriendo en puerto ${PORT}`);
    console.log(`📚 Documentación disponible en http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;