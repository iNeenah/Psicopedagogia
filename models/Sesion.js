const { pool } = require('../config/database');

class Sesion {
  constructor(data) {
    this.id = data.id;
    this.paciente_id = data.paciente_id;
    this.profesional_id = data.profesional_id;
    this.fecha_hora = data.fecha_hora;
    this.duracion_minutos = data.duracion_minutos;
    this.tipo_sesion = data.tipo_sesion;
    this.estado = data.estado;
    this.notas_sesion = data.notas_sesion;
    this.observaciones = data.observaciones;
    this.costo = data.costo;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    
    // Datos relacionados si están disponibles
    if (data.paciente_nombre) {
      this.paciente = {
        id: data.paciente_id,
        nombre: data.paciente_nombre,
        apellido: data.paciente_apellido,
        edad: data.paciente_edad
      };
    }
    
    if (data.profesional_nombre) {
      this.profesional = {
        id: data.profesional_id,
        nombre: data.profesional_nombre,
        apellido: data.profesional_apellido,
        especialidad: data.profesional_especialidad
      };
    }
  }

  // Crear nueva sesión
  static async create(sessionData) {
    const { 
      paciente_id, profesional_id, fecha_hora, duracion_minutos,
      tipo_sesion, notas_sesion, observaciones, costo 
    } = sessionData;
    
    const [result] = await pool.execute(
      `INSERT INTO sesiones 
       (paciente_id, profesional_id, fecha_hora, duracion_minutos, 
        tipo_sesion, notas_sesion, observaciones, costo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [paciente_id, profesional_id, fecha_hora, duracion_minutos,
       tipo_sesion, notas_sesion, observaciones, costo]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar sesión por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT s.*, 
        CONCAT(up.nombre, ' ', up.apellido) as paciente_nombre,
        up.nombre as paciente_nombre_solo,
        up.apellido as paciente_apellido,
        p.edad as paciente_edad,
        CONCAT(upr.nombre, ' ', upr.apellido) as profesional_nombre,
        upr.nombre as profesional_nombre_solo,
        upr.apellido as profesional_apellido,
        pr.especialidad as profesional_especialidad
       FROM sesiones s
       JOIN pacientes p ON s.paciente_id = p.id
       JOIN usuarios up ON p.usuario_id = up.id
       JOIN profesionales pr ON s.profesional_id = pr.id
       JOIN usuarios upr ON pr.usuario_id = upr.id
       WHERE s.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    return new Sesion(rows[0]);
  }

  // Obtener todas las sesiones con filtros
  static async findAll(filters = {}) {
    let query = `
      SELECT s.*, 
        CONCAT(up.nombre, ' ', up.apellido) as paciente_nombre,
        up.nombre as paciente_nombre_solo,
        up.apellido as paciente_apellido,
        p.edad as paciente_edad,
        CONCAT(upr.nombre, ' ', upr.apellido) as profesional_nombre,
        upr.nombre as profesional_nombre_solo,
        upr.apellido as profesional_apellido,
        pr.especialidad as profesional_especialidad
      FROM sesiones s
      JOIN pacientes p ON s.paciente_id = p.id
      JOIN usuarios up ON p.usuario_id = up.id
      JOIN profesionales pr ON s.profesional_id = pr.id
      JOIN usuarios upr ON pr.usuario_id = upr.id
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.paciente_id) {
      query += ' AND s.paciente_id = ?';
      params.push(filters.paciente_id);
    }
    
    if (filters.profesional_id) {
      query += ' AND s.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    if (filters.estado) {
      query += ' AND s.estado = ?';
      params.push(filters.estado);
    }
    
    if (filters.tipo_sesion) {
      query += ' AND s.tipo_sesion = ?';
      params.push(filters.tipo_sesion);
    }
    
    if (filters.fecha_desde) {
      query += ' AND DATE(s.fecha_hora) >= ?';
      params.push(filters.fecha_desde);
    }
    
    if (filters.fecha_hasta) {
      query += ' AND DATE(s.fecha_hora) <= ?';
      params.push(filters.fecha_hasta);
    }
    
    query += ' ORDER BY s.fecha_hora DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Sesion(row));
  }

  // Actualizar sesión
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    const allowedFields = [
      'fecha_hora', 'duracion_minutos', 'tipo_sesion', 'estado',
      'notas_sesion', 'observaciones', 'costo'
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
      `UPDATE sesiones SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Eliminar sesión
  static async delete(id) {
    await pool.execute('DELETE FROM sesiones WHERE id = ?', [id]);
    return true;
  }

  // Obtener sesiones próximas
  static async getUpcoming(filters = {}) {
    let query = `
      SELECT s.*, 
        CONCAT(up.nombre, ' ', up.apellido) as paciente_nombre,
        up.nombre as paciente_nombre_solo,
        up.apellido as paciente_apellido,
        p.edad as paciente_edad,
        CONCAT(upr.nombre, ' ', upr.apellido) as profesional_nombre,
        upr.nombre as profesional_nombre_solo,
        upr.apellido as profesional_apellido,
        pr.especialidad as profesional_especialidad
      FROM sesiones s
      JOIN pacientes p ON s.paciente_id = p.id
      JOIN usuarios up ON p.usuario_id = up.id
      JOIN profesionales pr ON s.profesional_id = pr.id
      JOIN usuarios upr ON pr.usuario_id = upr.id
      WHERE s.fecha_hora >= NOW() AND s.estado = 'programada'
    `;
    const params = [];
    
    if (filters.profesional_id) {
      query += ' AND s.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    if (filters.paciente_id) {
      query += ' AND s.paciente_id = ?';
      params.push(filters.paciente_id);
    }
    
    query += ' ORDER BY s.fecha_hora ASC LIMIT 10';
    
    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Sesion(row));
  }

  // Verificar disponibilidad de horario
  static async checkAvailability(profesional_id, fecha_hora, duracion_minutos = 50, excludeId = null) {
    let query = `
      SELECT COUNT(*) as conflictos
      FROM sesiones 
      WHERE profesional_id = ? 
      AND estado IN ('programada', 'realizada')
      AND (
        (fecha_hora <= ? AND DATE_ADD(fecha_hora, INTERVAL duracion_minutos MINUTE) > ?) OR
        (fecha_hora < DATE_ADD(?, INTERVAL ? MINUTE) AND DATE_ADD(fecha_hora, INTERVAL duracion_minutos MINUTE) >= DATE_ADD(?, INTERVAL ? MINUTE))
      )
    `;
    const params = [profesional_id, fecha_hora, fecha_hora, fecha_hora, duracion_minutos, fecha_hora, duracion_minutos];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows[0].conflictos === 0;
  }

  // Obtener estadísticas de sesiones
  static async getStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_sesiones,
        COUNT(CASE WHEN estado = 'programada' THEN 1 END) as programadas,
        COUNT(CASE WHEN estado = 'realizada' THEN 1 END) as realizadas,
        COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as canceladas,
        COUNT(CASE WHEN estado = 'no_asistio' THEN 1 END) as no_asistio,
        AVG(costo) as promedio_costo,
        SUM(CASE WHEN estado = 'realizada' THEN costo ELSE 0 END) as ingresos_realizados
      FROM sesiones s
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.profesional_id) {
      query += ' AND s.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    if (filters.paciente_id) {
      query += ' AND s.paciente_id = ?';
      params.push(filters.paciente_id);
    }
    
    if (filters.fecha_desde) {
      query += ' AND DATE(s.fecha_hora) >= ?';
      params.push(filters.fecha_desde);
    }
    
    if (filters.fecha_hasta) {
      query += ' AND DATE(s.fecha_hora) <= ?';
      params.push(filters.fecha_hasta);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows[0];
  }
}

module.exports = Sesion;