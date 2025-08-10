const { testConnection } = require('./database');

// Función para inicializar la aplicación
const initializeApp = async () => {
  try {
    console.log('🚀 Iniciando aplicación...');
    
    // Probar conexión a la base de datos
    await testConnection();
    
    console.log('✅ Aplicación inicializada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error.message);
    return false;
  }
};

module.exports = { initializeApp };