const { pool } = require('../config/database');

class Evaluacion {
  constructor(data) {
    this.id = data.id;
    this.paciente_id = data.paciente_id;
    this.profesional_id = data.profesional_id;
    this.sesion_id = data.sesion_id;
    this.fecha_evaluacion = data.fecha_evaluacion;
    this.tipo_evaluacion = data.tipo_evaluacion;
    this.area_evaluada = data.area_evaluada;
    this.instrumentos_utilizados = data.instrumentos_utilizados;
    this.resultados = data.resultados;
    this.interpretacion = data.interpretacion;
    this.recomendaciones = data.recomendaciones;
    this.objetivos_terapeuticos = data.objetivos_terapeuticos;
    this.archivo_adjunto = data.archivo_adjunto;
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

  // Crear nueva evaluación
  static async create(evaluationData) {
    const { 
      paciente_id, profesional_id, sesion_id, fecha_evaluacion,
      tipo_evaluacion, area_evaluada, instrumentos_utilizados,
      resultados, interpretacion, recomendaciones, objetivos_terapeuticos,
      archivo_adjunto
    } = evaluationData;
    
    const [result] = await pool.execute(
      `INSERT INTO evaluaciones 
       (paciente_id, profesional_id, sesion_id, fecha_evaluacion, 
        tipo_evaluacion, area_evaluada, instrumentos_utilizados,
        resultados, interpretacion, recomendaciones, objetivos_terapeuticos,
        archivo_adjunto) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paciente_id, profesional_id, sesion_id, fecha_evaluacion,
       tipo_evaluacion, area_evaluada, instrumentos_utilizados,
       resultados, interpretacion, recomendaciones, objetivos_terapeuticos,
       archivo_adjunto]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar evaluación por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT e.*, 
        CONCAT(up.nombre, ' ', up.apellido) as paciente_nombre,
        up.nombre as paciente_nombre_solo,
        up.apellido as paciente_apellido,
        p.edad as paciente_edad,
        CONCAT(upr.nombre, ' ', upr.apellido) as profesional_nombre,
        upr.nombre as profesional_nombre_solo,
        upr.apellido as profesional_apellido,
        pr.especialidad as profesional_especialidad
       FROM evaluaciones e
       JOIN pacientes p ON e.paciente_id = p.id
       JOIN usuarios up ON p.usuario_id = up.id
       JOIN profesionales pr ON e.profesional_id = pr.id
       JOIN usuarios upr ON pr.usuario_id = upr.id
       WHERE e.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    return new Evaluacion(rows[0]);
  }

  // Obtener todas las evaluaciones con filtros
  static async findAll(filters = {}) {
    let query = `
      SELECT e.*, 
        CONCAT(up.nombre, ' ', up.apellido) as paciente_nombre,
        up.nombre as paciente_nombre_solo,
        up.apellido as paciente_apellido,
        p.edad as paciente_edad,
        CONCAT(upr.nombre, ' ', upr.apellido) as profesional_nombre,
        upr.nombre as profesional_nombre_solo,
        upr.apellido as profesional_apellido,
        pr.especialidad as profesional_especialidad
      FROM evaluaciones e
      JOIN pacientes p ON e.paciente_id = p.id
      JOIN usuarios up ON p.usuario_id = up.id
      JOIN profesionales pr ON e.profesional_id = pr.id
      JOIN usuarios upr ON pr.usuario_id = upr.id
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.paciente_id) {
      query += ' AND e.paciente_id = ?';
      params.push(filters.paciente_id);
    }
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    if (filters.tipo_evaluacion) {
      query += ' AND e.tipo_evaluacion = ?';
      params.push(filters.tipo_evaluacion);
    }
    
    if (filters.area_evaluada) {
      query += ' AND FIND_IN_SET(?, e.area_evaluada) > 0';
      params.push(filters.area_evaluada);
    }
    
    if (filters.fecha_desde) {
      query += ' AND DATE(e.fecha_evaluacion) >= ?';
      params.push(filters.fecha_desde);
    }
    
    if (filters.fecha_hasta) {
      query += ' AND DATE(e.fecha_evaluacion) <= ?';
      params.push(filters.fecha_hasta);
    }
    
    query += ' ORDER BY e.fecha_evaluacion DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Evaluacion(row));
  }

  // Actualizar evaluación
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    const allowedFields = [
      'fecha_evaluacion', 'tipo_evaluacion', 'area_evaluada',
      'instrumentos_utilizados', 'resultados', 'interpretacion',
      'recomendaciones', 'objetivos_terapeuticos', 'archivo_adjunto'
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
      `UPDATE evaluaciones SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Eliminar evaluación
  static async delete(id) {
    await pool.execute('DELETE FROM evaluaciones WHERE id = ?', [id]);
    return true;
  }

  // Obtener evaluaciones por paciente
  static async findByPatient(paciente_id) {
    const [rows] = await pool.execute(
      `SELECT e.*, 
        CONCAT(upr.nombre, ' ', upr.apellido) as profesional_nombre,
        pr.especialidad as profesional_especialidad
       FROM evaluaciones e
       JOIN profesionales pr ON e.profesional_id = pr.id
       JOIN usuarios upr ON pr.usuario_id = upr.id
       WHERE e.paciente_id = ?
       ORDER BY e.fecha_evaluacion DESC`,
      [paciente_id]
    );
    
    return rows.map(row => new Evaluacion(row));
  }

  // Obtener evaluaciones por profesional
  static async findByProfessional(profesional_id) {
    const [rows] = await pool.execute(
      `SELECT e.*, 
        CONCAT(up.nombre, ' ', up.apellido) as paciente_nombre,
        p.edad as paciente_edad
       FROM evaluaciones e
       JOIN pacientes p ON e.paciente_id = p.id
       JOIN usuarios up ON p.usuario_id = up.id
       WHERE e.profesional_id = ?
       ORDER BY e.fecha_evaluacion DESC`,
      [profesional_id]
    );
    
    return rows.map(row => new Evaluacion(row));
  }

  // Obtener estadísticas de evaluaciones
  static async getStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_evaluaciones,
        COUNT(CASE WHEN tipo_evaluacion = 'inicial' THEN 1 END) as evaluaciones_iniciales,
        COUNT(CASE WHEN tipo_evaluacion = 'seguimiento' THEN 1 END) as evaluaciones_seguimiento,
        COUNT(CASE WHEN tipo_evaluacion = 'final' THEN 1 END) as evaluaciones_finales,
        COUNT(CASE WHEN tipo_evaluacion = 'neuropsicologica' THEN 1 END) as evaluaciones_neuropsicologicas,
        COUNT(CASE WHEN tipo_evaluacion = 'psicopedagogica' THEN 1 END) as evaluaciones_psicopedagogicas
      FROM evaluaciones e
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    if (filters.paciente_id) {
      query += ' AND e.paciente_id = ?';
      params.push(filters.paciente_id);
    }
    
    if (filters.fecha_desde) {
      query += ' AND DATE(e.fecha_evaluacion) >= ?';
      params.push(filters.fecha_desde);
    }
    
    if (filters.fecha_hasta) {
      query += ' AND DATE(e.fecha_evaluacion) <= ?';
      params.push(filters.fecha_hasta);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows[0];
  }

  // Obtener áreas más evaluadas
  static async getAreasStats(filters = {}) {
    let query = `
      SELECT 
        'cognitiva' as area,
        COUNT(CASE WHEN FIND_IN_SET('cognitiva', area_evaluada) > 0 THEN 1 END) as cantidad
      FROM evaluaciones e
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    query += `
      UNION ALL
      SELECT 'emocional' as area, COUNT(CASE WHEN FIND_IN_SET('emocional', area_evaluada) > 0 THEN 1 END) as cantidad FROM evaluaciones e WHERE 1=1
    `;
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    query += `
      UNION ALL
      SELECT 'conductual' as area, COUNT(CASE WHEN FIND_IN_SET('conductual', area_evaluada) > 0 THEN 1 END) as cantidad FROM evaluaciones e WHERE 1=1
    `;
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    query += `
      UNION ALL
      SELECT 'academica' as area, COUNT(CASE WHEN FIND_IN_SET('academica', area_evaluada) > 0 THEN 1 END) as cantidad FROM evaluaciones e WHERE 1=1
    `;
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    query += `
      UNION ALL
      SELECT 'social' as area, COUNT(CASE WHEN FIND_IN_SET('social', area_evaluada) > 0 THEN 1 END) as cantidad FROM evaluaciones e WHERE 1=1
    `;
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    query += `
      UNION ALL
      SELECT 'familiar' as area, COUNT(CASE WHEN FIND_IN_SET('familiar', area_evaluada) > 0 THEN 1 END) as cantidad FROM evaluaciones e WHERE 1=1
    `;
    
    if (filters.profesional_id) {
      query += ' AND e.profesional_id = ?';
      params.push(filters.profesional_id);
    }
    
    query += ' ORDER BY cantidad DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Obtener las áreas evaluadas como array
  getAreasEvaluadas() {
    return this.area_evaluada ? this.area_evaluada.split(',') : [];
  }
}

module.exports = Evaluacion;