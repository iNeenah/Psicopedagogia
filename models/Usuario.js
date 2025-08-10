const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.telefono = data.telefono;
    this.rol = data.rol;
    this.activo = data.activo;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
  }

  // Crear nuevo usuario
  static async create(userData) {
    const { email, password, nombre, apellido, telefono, rol } = userData;
    
    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const [result] = await pool.execute(
      `INSERT INTO usuarios (email, password, nombre, apellido, telefono, rol) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, nombre, apellido, telefono, rol]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar usuario por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE id = ? AND activo = TRUE',
      [id]
    );
    
    if (rows.length === 0) return null;
    return new Usuario(rows[0]);
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
      [email]
    );
    
    if (rows.length === 0) return null;
    return new Usuario(rows[0]);
  }

  // Obtener todos los usuarios
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM usuarios WHERE activo = TRUE';
    const params = [];
    
    if (filters.rol) {
      query += ' AND rol = ?';
      params.push(filters.rol);
    }
    
    query += ' ORDER BY fecha_creacion DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Usuario(row));
  }

  // Actualizar usuario
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    // Campos permitidos para actualizar
    const allowedFields = ['nombre', 'apellido', 'telefono', 'email'];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Cambiar contraseña
  static async changePassword(id, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await pool.execute(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    return true;
  }

  // Desactivar usuario (soft delete)
  static async deactivate(id) {
    await pool.execute(
      'UPDATE usuarios SET activo = FALSE WHERE id = ?',
      [id]
    );
    
    return true;
  }

  // Verificar contraseña
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Obtener datos públicos (sin contraseña)
  toPublicJSON() {
    const { password, ...publicData } = this;
    return publicData;
  }
}

module.exports = Usuario;