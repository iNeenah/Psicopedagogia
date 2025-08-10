-- =====================================================
-- SCRIPT COMPLETO DE CREACIÓN DE BASE DE DATOS
-- Clínica de Psicopedagogía y Psicología
-- Basado en los modelos del proyecto
-- =====================================================

-- Eliminar base de datos si existe (CUIDADO: esto borra todo)
-- DROP DATABASE IF EXISTS clinica_psicopedagogia;

-- Crear base de datos con codificación UTF-8
CREATE DATABASE IF NOT EXISTS clinica_psicopedagogia 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE clinica_psicopedagogia;

-- =====================================================
-- ELIMINAR TABLAS EXISTENTES (en orden correcto por FK)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS evaluaciones;
DROP TABLE IF EXISTS sesiones;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS profesionales;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- TABLA 1: USUARIOS (Modelo Usuario.js)
-- =====================================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email único del usuario',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con bcrypt',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del usuario',
    apellido VARCHAR(50) NOT NULL COMMENT 'Apellido del usuario',
    telefono VARCHAR(20) COMMENT 'Teléfono de contacto',
    rol ENUM('profesional', 'paciente') NOT NULL COMMENT 'Rol del usuario en el sistema',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo (soft delete)',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    -- Índices para optimización
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo),
    INDEX idx_fecha_creacion (fecha_creacion)
) COMMENT 'Tabla principal de usuarios del sistema';

-- =====================================================
-- TABLA 2: PROFESIONALES (Modelo Profesional.js)
-- =====================================================
CREATE TABLE profesionales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL COMMENT 'Referencia al usuario (relación 1:1)',
    matricula VARCHAR(20) UNIQUE NOT NULL COMMENT 'Matrícula profesional única',
    especialidad ENUM('psicologo', 'psicopedagogo', 'ambos') NOT NULL COMMENT 'Especialidad del profesional',
    anos_experiencia INT DEFAULT 0 COMMENT 'Años de experiencia profesional',
    tarifa_sesion DECIMAL(10,2) COMMENT 'Tarifa por sesión en pesos argentinos',
    horario_inicio TIME DEFAULT '09:00:00' COMMENT 'Hora de inicio de atención',
    horario_fin TIME DEFAULT '18:00:00' COMMENT 'Hora de fin de atención',
    dias_atencion SET('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado') 
        DEFAULT 'lunes,martes,miercoles,jueves,viernes' COMMENT 'Días de atención',
    biografia TEXT COMMENT 'Biografía y descripción profesional',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    
    -- Claves foráneas
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices para optimización
    INDEX idx_matricula (matricula),
    INDEX idx_especialidad (especialidad),
    INDEX idx_activo (activo),
    INDEX idx_tarifa (tarifa_sesion)
) COMMENT 'Información específica de profesionales (psicólogos y psicopedagogos)';

-- =====================================================
-- TABLA 3: PACIENTES (Modelo Paciente.js)
-- =====================================================
CREATE TABLE pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL COMMENT 'Referencia al usuario (relación 1:1)',
    fecha_nacimiento DATE NOT NULL COMMENT 'Fecha de nacimiento del paciente',
    edad INT COMMENT 'Edad del paciente (se calcula automáticamente con trigger)',
    motivo_consulta TEXT NOT NULL COMMENT 'Motivo principal de la consulta',
    derivado_por VARCHAR(100) COMMENT 'Quién derivó al paciente (escuela, médico, etc.)',
    obra_social VARCHAR(100) COMMENT 'Obra social del paciente',
    numero_afiliado VARCHAR(50) COMMENT 'Número de afiliado a la obra social',
    responsable_nombre VARCHAR(100) COMMENT 'Nombre del responsable (si es menor de edad)',
    responsable_telefono VARCHAR(20) COMMENT 'Teléfono del responsable',
    responsable_email VARCHAR(100) COMMENT 'Email del responsable',
    observaciones TEXT COMMENT 'Observaciones adicionales sobre el paciente',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    
    -- Claves foráneas
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices para optimización
    INDEX idx_edad (edad),
    INDEX idx_obra_social (obra_social),
    INDEX idx_activo (activo),
    INDEX idx_fecha_nacimiento (fecha_nacimiento)
) COMMENT 'Información específica de pacientes';

-- =====================================================
-- TABLA 4: SESIONES (Modelo Sesion.js)
-- =====================================================
CREATE TABLE sesiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL COMMENT 'ID del paciente',
    profesional_id INT NOT NULL COMMENT 'ID del profesional',
    fecha_hora DATETIME NOT NULL COMMENT 'Fecha y hora de la sesión',
    duracion_minutos INT DEFAULT 50 COMMENT 'Duración de la sesión en minutos',
    tipo_sesion ENUM('evaluacion', 'tratamiento', 'seguimiento', 'interconsulta') NOT NULL COMMENT 'Tipo de sesión',
    estado ENUM('programada', 'realizada', 'cancelada', 'no_asistio') DEFAULT 'programada' COMMENT 'Estado actual de la sesión',
    notas_sesion TEXT COMMENT 'Notas y observaciones de la sesión',
    observaciones TEXT COMMENT 'Observaciones adicionales',
    costo DECIMAL(10,2) COMMENT 'Costo de la sesión',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    -- Claves foráneas
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id) ON DELETE CASCADE,
    
    -- Índices para optimización
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_paciente_profesional (paciente_id, profesional_id),
    INDEX idx_estado (estado),
    INDEX idx_tipo_sesion (tipo_sesion),
    INDEX idx_fecha_creacion (fecha_creacion)
) COMMENT 'Sesiones entre profesionales y pacientes';

-- =====================================================
-- TABLA 5: EVALUACIONES (Modelo Evaluacion.js)
-- =====================================================
CREATE TABLE evaluaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL COMMENT 'ID del paciente evaluado',
    profesional_id INT NOT NULL COMMENT 'ID del profesional que realiza la evaluación',
    sesion_id INT COMMENT 'ID de la sesión relacionada (opcional)',
    fecha_evaluacion DATE NOT NULL COMMENT 'Fecha de la evaluación',
    tipo_evaluacion ENUM('inicial', 'seguimiento', 'final', 'neuropsicologica', 'psicopedagogica') NOT NULL COMMENT 'Tipo de evaluación realizada',
    area_evaluada SET('cognitiva', 'emocional', 'conductual', 'academica', 'social', 'familiar') NOT NULL COMMENT 'Áreas evaluadas (múltiples)',
    instrumentos_utilizados TEXT COMMENT 'Instrumentos y tests utilizados en la evaluación',
    resultados TEXT NOT NULL COMMENT 'Resultados obtenidos en la evaluación',
    interpretacion TEXT COMMENT 'Interpretación profesional de los resultados',
    recomendaciones TEXT COMMENT 'Recomendaciones terapéuticas y de tratamiento',
    objetivos_terapeuticos TEXT COMMENT 'Objetivos del tratamiento propuesto',
    archivo_adjunto VARCHAR(255) COMMENT 'Ruta del archivo adjunto (informes, etc.)',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    -- Claves foráneas
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_id) REFERENCES sesiones(id) ON DELETE SET NULL,
    
    -- Índices para optimización
    INDEX idx_paciente_fecha (paciente_id, fecha_evaluacion),
    INDEX idx_profesional_fecha (profesional_id, fecha_evaluacion),
    INDEX idx_tipo_evaluacion (tipo_evaluacion),
    INDEX idx_fecha_evaluacion (fecha_evaluacion),
    INDEX idx_sesion (sesion_id)
) COMMENT 'Evaluaciones y seguimientos de pacientes';

-- =====================================================
-- TRIGGERS PARA CALCULAR EDAD AUTOMÁTICAMENTE
-- =====================================================

-- Trigger para calcular edad al insertar
DELIMITER $$
CREATE TRIGGER tr_pacientes_edad_insert
    BEFORE INSERT ON pacientes
    FOR EACH ROW
BEGIN
    SET NEW.edad = YEAR(CURDATE()) - YEAR(NEW.fecha_nacimiento) - 
                   (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(NEW.fecha_nacimiento, '%m%d'));
END$$

-- Trigger para recalcular edad al actualizar fecha_nacimiento
CREATE TRIGGER tr_pacientes_edad_update
    BEFORE UPDATE ON pacientes
    FOR EACH ROW
BEGIN
    IF NEW.fecha_nacimiento != OLD.fecha_nacimiento THEN
        SET NEW.edad = YEAR(CURDATE()) - YEAR(NEW.fecha_nacimiento) - 
                       (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(NEW.fecha_nacimiento, '%m%d'));
    END IF;
END$$
DELIMITER ;

-- =====================================================
-- DATOS DE EJEMPLO PARA TESTING
-- =====================================================

-- Insertar usuarios de ejemplo (contraseña: "password")
INSERT INTO usuarios (email, password, nombre, apellido, telefono, rol) VALUES
('dr.martinez@clinica.com', '$2a$10$NaoCD3hCfg48Mzh1.1dg1eCJ4vuejFU7.Y.7Uz2OAoOvgepqcISv.', 'Carlos', 'Martínez', '11-1234-5678', 'profesional'),
('dra.lopez@clinica.com', '$2a$10$NaoCD3hCfg48Mzh1.1dg1eCJ4vuejFU7.Y.7Uz2OAoOvgepqcISv.', 'Ana', 'López', '11-1234-5679', 'profesional'),
('dra.rodriguez@clinica.com', '$2a$10$NaoCD3hCfg48Mzh1.1dg1eCJ4vuejFU7.Y.7Uz2OAoOvgepqcISv.', 'Laura', 'Rodríguez', '11-1234-5680', 'profesional'),
('maria.gonzalez@email.com', '$2a$10$NaoCD3hCfg48Mzh1.1dg1eCJ4vuejFU7.Y.7Uz2OAoOvgepqcISv.', 'María', 'González', '11-9876-5432', 'paciente'),
('juan.perez@email.com', '$2a$10$NaoCD3hCfg48Mzh1.1dg1eCJ4vuejFU7.Y.7Uz2OAoOvgepqcISv.', 'Juan', 'Pérez', '11-9876-5433', 'paciente'),
('sofia.martinez@email.com', '$2a$10$NaoCD3hCfg48Mzh1.1dg1eCJ4vuejFU7.Y.7Uz2OAoOvgepqcISv.', 'Sofía', 'Martínez', '11-9876-5434', 'paciente');

-- Insertar profesionales de ejemplo
INSERT INTO profesionales (usuario_id, matricula, especialidad, anos_experiencia, tarifa_sesion, horario_inicio, horario_fin, dias_atencion, biografia) VALUES
(1, 'PSI-001', 'psicologo', 10, 5000.00, '09:00:00', '18:00:00', 'lunes,martes,miercoles,jueves,viernes', 'Psicólogo especializado en terapia cognitivo-conductual con 10 años de experiencia en el tratamiento de trastornos de ansiedad y depresión en niños y adolescentes.'),
(2, 'PSP-002', 'psicopedagogo', 8, 4500.00, '08:00:00', '16:00:00', 'lunes,martes,miercoles,jueves,viernes', 'Psicopedagoga especializada en dificultades de aprendizaje y trastornos del neurodesarrollo. Amplia experiencia en evaluación e intervención psicopedagógica.'),
(3, 'PSI-003', 'ambos', 12, 5500.00, '10:00:00', '19:00:00', 'lunes,martes,miercoles,jueves,viernes,sabado', 'Profesional con doble titulación en Psicología y Psicopedagogía. Especialista en evaluación neuropsicológica y rehabilitación cognitiva.');

-- Insertar pacientes de ejemplo (la edad se calcula automáticamente con el trigger)
INSERT INTO pacientes (usuario_id, fecha_nacimiento, motivo_consulta, derivado_por, obra_social, numero_afiliado, responsable_nombre, responsable_telefono, responsable_email, observaciones) VALUES
(4, '2010-05-15', 'Dificultades de aprendizaje en matemáticas y problemas de atención en el aula escolar. La maestra reporta que se distrae fácilmente y tiene dificultades para completar las tareas.', 'Escuela Primaria San José', 'OSDE', '123456789', 'Carmen González', '11-9876-5435', 'carmen.gonzalez@email.com', 'Paciente colaborador, buena relación con los padres.'),
(5, '2008-08-20', 'Problemas de atención y concentración, posible TDAH. Dificultades en el rendimiento académico y comportamiento disruptivo en casa y escuela.', 'Dr. Pediatra Juan Carlos Ruiz', 'Swiss Medical', '987654321', 'Roberto Pérez', '11-9876-5436', 'roberto.perez@email.com', 'Familia muy comprometida con el tratamiento.'),
(6, '2015-12-03', 'Evaluación del desarrollo del lenguaje y habilidades sociales. Retraso en la adquisición del lenguaje expresivo.', 'Centro de Estimulación Temprana', 'IOMA', '456789123', 'Patricia Martínez', '11-9876-5437', 'patricia.martinez@email.com', 'Requiere seguimiento interdisciplinario.');

-- Insertar sesiones de ejemplo
INSERT INTO sesiones (paciente_id, profesional_id, fecha_hora, duracion_minutos, tipo_sesion, estado, notas_sesion, observaciones, costo) VALUES
(1, 2, '2024-02-15 10:00:00', 60, 'evaluacion', 'realizada', 'Primera sesión de evaluación psicopedagógica. El paciente mostró buena disposición y colaboración durante toda la sesión. Se aplicaron pruebas de matemáticas básicas.', 'Paciente muy colaborador, se estableció buen rapport.', 4500.00),
(1, 2, '2024-02-22 10:00:00', 50, 'seguimiento', 'programada', NULL, 'Segunda sesión programada para continuar evaluación.', 4500.00),
(2, 1, '2024-02-16 14:00:00', 60, 'evaluacion', 'realizada', 'Evaluación inicial para descartar TDAH. Se aplicaron pruebas de atención y concentración. El paciente mostró dificultades significativas en tareas de atención sostenida.', 'Se recomienda continuar con evaluación neuropsicológica.', 5000.00),
(3, 3, '2024-02-17 09:00:00', 45, 'evaluacion', 'programada', NULL, 'Primera evaluación del desarrollo del lenguaje.', 5500.00),
(2, 1, '2024-02-23 14:00:00', 50, 'tratamiento', 'programada', NULL, 'Primera sesión de tratamiento cognitivo-conductual.', 5000.00);

-- Insertar evaluaciones de ejemplo
INSERT INTO evaluaciones (paciente_id, profesional_id, sesion_id, fecha_evaluacion, tipo_evaluacion, area_evaluada, instrumentos_utilizados, resultados, interpretacion, recomendaciones, objetivos_terapeuticos) VALUES
(1, 2, 1, '2024-02-15', 'inicial', 'cognitiva,academica', 'WISC-V (Escala de Inteligencia de Wechsler para Niños), Test de Bender, Evaluación de habilidades matemáticas específicas, Pruebas de memoria de trabajo', 'El paciente presenta un CI total dentro del rango promedio (95). Sin embargo, se observan dificultades específicas en el procesamiento de información matemática, especialmente en operaciones que requieren memoria de trabajo. Las habilidades de comprensión verbal se encuentran dentro de la normalidad. Se detectan dificultades en el cálculo mental y resolución de problemas matemáticos complejos.', 'Los resultados sugieren un perfil compatible con dificultades específicas del aprendizaje en el área matemática (discalculia). No se observan déficits cognitivos generales, sino dificultades específicas en el procesamiento numérico.', 'Se recomienda: 1) Intervención psicopedagógica específica para matemáticas, 2) Estrategias de apoyo en el aula escolar, 3) Seguimiento trimestral para evaluar progreso, 4) Coordinación con docentes para implementar adaptaciones curriculares.', '1. Mejorar estrategias de cálculo mental y automatización de operaciones básicas, 2. Desarrollar habilidades de resolución de problemas matemáticos paso a paso, 3. Fortalecer la autoestima académica y motivación hacia las matemáticas, 4. Implementar técnicas de organización y planificación para tareas matemáticas'),

(2, 1, 3, '2024-02-16', 'neuropsicologica', 'cognitiva,conductual', 'WISC-V, Test de Atención Sostenida (CPT-3), Escala Conners para padres y maestros, Test de Stroop, Torre de Londres, Figura Compleja de Rey', 'Se observan dificultades significativas en atención sostenida (percentil 15), control inhibitorio deficitario (percentil 10), y hiperactividad moderada según reportes de padres y maestros. Las funciones ejecutivas se encuentran por debajo del promedio esperado para la edad. La memoria de trabajo presenta limitaciones importantes. CI total: 102 (promedio).', 'El perfil neuropsicológico es compatible con Trastorno por Déficit de Atención e Hiperactividad (TDAH) de tipo combinado. Las dificultades atencionaes y ejecutivas impactan significativamente en el rendimiento académico y funcionamiento social.', 'Se recomienda: 1) Derivación a psiquiatra infantil para evaluación farmacológica, 2) Terapia cognitivo-conductual para el manejo de síntomas, 3) Estrategias de manejo conductual en casa y escuela, 4) Adaptaciones académicas, 5) Seguimiento interdisciplinario.', '1. Mejorar la capacidad de atención sostenida mediante técnicas específicas, 2. Desarrollar estrategias de autocontrol y autorregulación emocional, 3. Reducir comportamientos disruptivos en diferentes contextos, 4. Fortalecer habilidades sociales y de comunicación, 5. Implementar rutinas y estructura en actividades diarias');

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================

-- Mostrar resumen de datos insertados
SELECT 'USUARIOS' as Tabla, COUNT(*) as Total FROM usuarios
UNION ALL
SELECT 'PROFESIONALES' as Tabla, COUNT(*) as Total FROM profesionales
UNION ALL
SELECT 'PACIENTES' as Tabla, COUNT(*) as Total FROM pacientes
UNION ALL
SELECT 'SESIONES' as Tabla, COUNT(*) as Total FROM sesiones
UNION ALL
SELECT 'EVALUACIONES' as Tabla, COUNT(*) as Total FROM evaluaciones;

-- =====================================================
-- CONSULTAS DE VERIFICACIÓN
-- =====================================================

-- Ver usuarios con sus roles
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.rol,
    u.activo,
    u.fecha_creacion
FROM usuarios u
ORDER BY u.rol, u.apellido;

-- Ver profesionales con información completa
SELECT 
    p.id,
    CONCAT(u.nombre, ' ', u.apellido) as profesional,
    p.matricula,
    p.especialidad,
    p.anos_experiencia,
    p.tarifa_sesion,
    p.dias_atencion
FROM profesionales p
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.activo = TRUE
ORDER BY u.apellido;

-- Ver pacientes con información básica y edad calculada
SELECT 
    pac.id,
    CONCAT(u.nombre, ' ', u.apellido) as paciente,
    pac.fecha_nacimiento,
    pac.edad as edad_calculada,
    YEAR(CURDATE()) - YEAR(pac.fecha_nacimiento) - 
    (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(pac.fecha_nacimiento, '%m%d')) as edad_verificacion,
    LEFT(pac.motivo_consulta, 50) as motivo_consulta_resumen,
    pac.obra_social,
    pac.responsable_nombre
FROM pacientes pac
JOIN usuarios u ON pac.usuario_id = u.id
WHERE pac.activo = TRUE
ORDER BY u.apellido;

-- Ver sesiones programadas
SELECT 
    s.id,
    CONCAT(up.nombre, ' ', up.apellido) as paciente,
    CONCAT(upr.nombre, ' ', upr.apellido) as profesional,
    s.fecha_hora,
    s.tipo_sesion,
    s.estado,
    s.costo
FROM sesiones s
JOIN pacientes p ON s.paciente_id = p.id
JOIN usuarios up ON p.usuario_id = up.id
JOIN profesionales pr ON s.profesional_id = pr.id
JOIN usuarios upr ON pr.usuario_id = upr.id
ORDER BY s.fecha_hora;

-- Ver evaluaciones realizadas
SELECT 
    e.id,
    CONCAT(up.nombre, ' ', up.apellido) as paciente,
    CONCAT(upr.nombre, ' ', upr.apellido) as profesional,
    e.fecha_evaluacion,
    e.tipo_evaluacion,
    e.area_evaluada
FROM evaluaciones e
JOIN pacientes p ON e.paciente_id = p.id
JOIN usuarios up ON p.usuario_id = up.id
JOIN profesionales pr ON e.profesional_id = pr.id
JOIN usuarios upr ON pr.usuario_id = upr.id
ORDER BY e.fecha_evaluacion DESC;

-- =====================================================
-- MENSAJE DE FINALIZACIÓN
-- =====================================================

SELECT '✅ Base de datos creada exitosamente con todos los datos de ejemplo!' as Mensaje,
       'Contraseña para todos los usuarios: password' as Credenciales,
       'La API está lista para ser probada' as Estado;