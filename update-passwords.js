const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

const updatePasswords = async () => {
  try {
    console.log('🔐 Actualizando contraseñas en la base de datos...');
    
    // Generar hash para "password"
    const password = 'password';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Hash generado:', hashedPassword);
    
    // Actualizar todas las contraseñas
    const [result] = await pool.execute(
      'UPDATE usuarios SET password = ? WHERE password LIKE "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"',
      [hashedPassword]
    );
    
    console.log(`✅ ${result.affectedRows} contraseñas actualizadas`);
    
    // Verificar usuarios actualizados
    const [users] = await pool.execute(
      'SELECT id, email, nombre, apellido, rol FROM usuarios ORDER BY rol, id'
    );
    
    console.log('\n👥 Usuarios disponibles para login:');
    users.forEach(user => {
      console.log(`  ${user.rol.toUpperCase()}: ${user.email} / password`);
      console.log(`    → ${user.nombre} ${user.apellido}`);
    });
    
    console.log('\n🧪 Ahora puedes probar el login con cualquiera de estos usuarios');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error actualizando contraseñas:', error);
    process.exit(1);
  }
};

updatePasswords();