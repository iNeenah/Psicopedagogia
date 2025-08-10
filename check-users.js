const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

const checkUsers = async () => {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...\n');
    
    // Obtener todos los usuarios
    const [users] = await pool.execute(
      'SELECT id, email, password, nombre, apellido, rol, activo FROM usuarios ORDER BY rol, id'
    );
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('💡 Ejecuta el script SQL para crear los datos de ejemplo');
      return;
    }
    
    console.log(`📊 Encontrados ${users.length} usuarios:\n`);
    
    for (const user of users) {
      console.log(`👤 ${user.nombre} ${user.apellido}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🎭 Rol: ${user.rol}`);
      console.log(`   ✅ Activo: ${user.activo ? 'Sí' : 'No'}`);
      console.log(`   🔐 Hash: ${user.password.substring(0, 20)}...`);
      
      // Probar si la contraseña "password" funciona
      try {
        const isValid = await bcrypt.compare('password', user.password);
        console.log(`   🧪 Test password: ${isValid ? '✅ Válida' : '❌ Inválida'}`);
      } catch (error) {
        console.log(`   🧪 Test password: ❌ Error - ${error.message}`);
      }
      
      console.log('');
    }
    
    // Probar login específico
    console.log('🧪 Probando login específico...');
    const testUser = users.find(u => u.email === 'dr.martinez@clinica.com');
    
    if (testUser) {
      const isValid = await bcrypt.compare('password', testUser.password);
      console.log(`\n🎯 Test dr.martinez@clinica.com:`);
      console.log(`   Usuario encontrado: ✅`);
      console.log(`   Usuario activo: ${testUser.activo ? '✅' : '❌'}`);
      console.log(`   Contraseña válida: ${isValid ? '✅' : '❌'}`);
      
      if (!isValid) {
        console.log('\n🔧 Actualizando contraseña...');
        const newHash = await bcrypt.hash('password', 10);
        await pool.execute(
          'UPDATE usuarios SET password = ? WHERE email = ?',
          [newHash, 'dr.martinez@clinica.com']
        );
        console.log('✅ Contraseña actualizada');
      }
    } else {
      console.log('❌ Usuario dr.martinez@clinica.com no encontrado');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();