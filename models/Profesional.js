const { pool } = require('../config/database');

class Profesional {
  constructor(data) {
    this.id = data.id;
    this.usuario_id = data.usuario_id;
    this.matricula = data.matricula;
    this.especialidad = data.especialidad;
    this.anos_experiencia = data.anos_experiencia;
    this.tarifa_sesion = data.tarifa_sesion;
    this.horario_inicio = data.horario_inicio;
    this.horario_fin = data.horario_fin;
    this.dias_atencion = data.dias_atencion;
    this.biografia = data.biografia;
    this.activo = data.activo;
    this.fecha_creacion = data.fecha_creacion;
    
    // Datos del usuario relacionado
    this.usuario = {
      id: data.usuario_id,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono
    };
  }

  // Crear nuevo profesional
  static async create(professionalData) {
    const { 
      usuario_id, matricula, especialidad, anos_experiencia, 
      tarifa_sesion, horario_inicio, horario_fin, dias_atencion, biografia 
    } = professionalData;
    
    const [result] = await pool.execute(
      `INSERT INTO profesionales 
       (usuario_id, matricula, especialidad, anos_experiencia, tarifa_sesion, 
        horario_inicio, horario_fin, dias_atencion, biografia) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, matricula, especialidad, anos_experiencia, tarifa_sesion, 
       horario_inicio, horario_fin, dias_atencion, biografia]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar profesional por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.email, u.nombre, u.apellido, u.telefono 
       FROM profesionales p 
       JOIN usuarios u ON p.usuario_id = u.id 
       WHERE p.id = ? AND p.activo = TRUE AND u.activo = TRUE`,
      [id]
    );
    
    if (rows.length === 0) return null;
    return new Profesional(rows[0]);
  }

  // Buscar profesional por usuario_id
  static async findByUserId(usuario_id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.email, u.nombre, u.apellido, u.telefono 
       FROM profesionales p 
       JOIN usuarios u ON p.usuario_id = u.id 
       WHERE p.usuario_id = ? AND p.activo = TRUE AND u.activo = TRUE`,
      [usuario_id]
    );
    
    if (rows.length === 0) return null;
    return new Profesional(rows[0]);
  }

  // Obtener todos los profesionales
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, u.email, u.nombre, u.apellido, u.telefono 
      FROM profesionales p 
      JOIN usuarios u ON p.usuario_id = u.id 
      WHERE p.activo = TRUE AND u.activo = TRUE
    `;
    const params = [];
    
    if (filters.especialidad) {
      query += ' AND p.especialidad = ?';
      params.push(filters.especialidad);
    }
    
    query += ' ORDER BY u.apellido, u.nombre';
    
    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Profesional(row));
  }

  // Actualizar profesional
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    const allowedFields = [
      'matricula', 'especialidad', 'anos_experiencia', 'tarifa_sesion',
      'horario_inicio', 'horario_fin', 'dias_atencion', 'biografia'
    ];
    
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
      `UPDATE profesionales SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Desactivar profesional
  static async deactivate(id) {
    await pool.execute(
      'UPDATE profesionales SET activo = FALSE WHERE id = ?',
      [id]
    );
    
    return true;
  }

  // Obtener estadísticas del profesional
  static async getStats(id) {
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(DISTINCT s.paciente_id) as total_pacientes,
        COUNT(s.id) as total_sesiones,
        COUNT(CASE WHEN s.estado = 'realizada' THEN 1 END) as sesiones_realizadas,
        COUNT(CASE WHEN s.estado = 'cancelada' THEN 1 END) as sesiones_canceladas,
        COUNT(e.id) as total_evaluaciones,
        AVG(s.costo) as promedio_costo_sesion
       FROM profesionales p
       LEFT JOIN sesiones s ON p.id = s.profesional_id
       LEFT JOIN evaluaciones e ON p.id = e.profesional_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );
    
    return stats[0] || {
      total_pacientes: 0,
      total_sesiones: 0,
      sesiones_realizadas: 0,
      sesiones_canceladas: 0,
      total_evaluaciones: 0,
      promedio_costo_sesion: 0
    };
  }

  // Obtener horarios disponibles
  getHorariosDisponibles() {
    const dias = this.dias_atencion ? this.dias_atencion.split(',') : [];
    return {
      dias_atencion: dias,
      horario_inicio: this.horario_inicio,
      horario_fin: this.horario_fin
    };
  }
}

module.exports = Profesional;