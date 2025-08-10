const { pool } = require('../config/database');

class Paciente {
  constructor(data) {
    this.id = data.id;
    this.usuario_id = data.usuario_id;
    this.fecha_nacimiento = data.fecha_nacimiento;
    this.edad = data.edad;
    this.motivo_consulta = data.motivo_consulta;
    this.derivado_por = data.derivado_por;
    this.obra_social = data.obra_social;
    this.numero_afiliado = data.numero_afiliado;
    this.responsable_nombre = data.responsable_nombre;
    this.responsable_telefono = data.responsable_telefono;
    this.responsable_email = data.responsable_email;
    this.observaciones = data.observaciones;
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

  // Crear nuevo paciente
  static async create(patientData) {
    const { 
      usuario_id, fecha_nacimiento, motivo_consulta, derivado_por,
      obra_social, numero_afiliado, responsable_nombre, 
      responsable_telefono, responsable_email, observaciones 
    } = patientData;
    
    const [result] = await pool.execute(
      `INSERT INTO pacientes 
       (usuario_id, fecha_nacimiento, motivo_consulta, derivado_por, 
        obra_social, numero_afiliado, responsable_nombre, 
        responsable_telefono, responsable_email, observaciones) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, fecha_nacimiento, motivo_consulta, derivado_por,
       obra_social, numero_afiliado, responsable_nombre, 
       responsable_telefono, responsable_email, observaciones]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar paciente por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.email, u.nombre, u.apellido, u.telefono 
       FROM pacientes p 
       JOIN usuarios u ON p.usuario_id = u.id 
       WHERE p.id = ? AND p.activo = TRUE AND u.activo = TRUE`,
      [id]
    );
    
    if (rows.length === 0) return null;
    return new Paciente(rows[0]);
  }

  // Buscar paciente por usuario_id
  static async findByUserId(usuario_id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.email, u.nombre, u.apellido, u.telefono 
       FROM pacientes p 
       JOIN usuarios u ON p.usuario_id = u.id 
       WHERE p.usuario_id = ? AND p.activo = TRUE AND u.activo = TRUE`,
      [usuario_id]
    );
    
    if (rows.length === 0) return null;
    return new Paciente(rows[0]);
  }

  // Obtener todos los pacientes
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, u.email, u.nombre, u.apellido, u.telefono 
      FROM pacientes p 
      JOIN usuarios u ON p.usuario_id = u.id 
      WHERE p.activo = TRUE AND u.activo = TRUE
    `;
    const params = [];
    
    if (filters.profesional_id) {
      query += ` AND p.id IN (
        SELECT DISTINCT paciente_id FROM sesiones 
        WHERE profesional_id = ?
      )`;
      params.push(filters.profesional_id);
    }
    
    if (filters.edad_min) {
      query += ' AND p.edad >= ?';
      params.push(filters.edad_min);
    }
    
    if (filters.edad_max) {
      query += ' AND p.edad <= ?';
      params.push(filters.edad_max);
    }
    
    query += ' ORDER BY u.apellido, u.nombre';
    
    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Paciente(row));
  }

  // Actualizar paciente
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    const allowedFields = [
      'fecha_nacimiento', 'motivo_consulta', 'derivado_por',
      'obra_social', 'numero_afiliado', 'responsable_nombre',
      'responsable_telefono', 'responsable_email', 'observaciones'
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
      `UPDATE pacientes SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Desactivar paciente
  static async deactivate(id) {
    await pool.execute(
      'UPDATE pacientes SET activo = FALSE WHERE id = ?',
      [id]
    );
    
    return true;
  }

  // Obtener historial del paciente
  static async getHistorial(id) {
    const [sesiones] = await pool.execute(
      `SELECT s.*, 
        CONCAT(u.nombre, ' ', u.apellido) as profesional_nombre,
        pr.especialidad
       FROM sesiones s
       JOIN profesionales pr ON s.profesional_id = pr.id
       JOIN usuarios u ON pr.usuario_id = u.id
       WHERE s.paciente_id = ?
       ORDER BY s.fecha_hora DESC`,
      [id]
    );

    const [evaluaciones] = await pool.execute(
      `SELECT e.*, 
        CONCAT(u.nombre, ' ', u.apellido) as profesional_nombre,
        pr.especialidad
       FROM evaluaciones e
       JOIN profesionales pr ON e.profesional_id = pr.id
       JOIN usuarios u ON pr.usuario_id = u.id
       WHERE e.paciente_id = ?
       ORDER BY e.fecha_evaluacion DESC`,
      [id]
    );

    return {
      sesiones,
      evaluaciones
    };
  }

  // Obtener estadísticas del paciente
  static async getStats(id) {
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(s.id) as total_sesiones,
        COUNT(CASE WHEN s.estado = 'realizada' THEN 1 END) as sesiones_realizadas,
        COUNT(CASE WHEN s.estado = 'cancelada' THEN 1 END) as sesiones_canceladas,
        COUNT(CASE WHEN s.estado = 'no_asistio' THEN 1 END) as sesiones_no_asistio,
        COUNT(e.id) as total_evaluaciones,
        MIN(s.fecha_hora) as primera_sesion,
        MAX(s.fecha_hora) as ultima_sesion
       FROM pacientes p
       LEFT JOIN sesiones s ON p.id = s.paciente_id
       LEFT JOIN evaluaciones e ON p.id = e.paciente_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );
    
    return stats[0] || {
      total_sesiones: 0,
      sesiones_realizadas: 0,
      sesiones_canceladas: 0,
      sesiones_no_asistio: 0,
      total_evaluaciones: 0,
      primera_sesion: null,
      ultima_sesion: null
    };
  }

  // Verificar si es menor de edad
  esMenorDeEdad() {
    return this.edad < 18;
  }

  // Obtener datos del responsable si es menor
  getDatosResponsable() {
    if (!this.esMenorDeEdad()) return null;
    
    return {
      nombre: this.responsable_nombre,
      telefono: this.responsable_telefono,
      email: this.responsable_email
    };
  }
}

module.exports = Paciente;