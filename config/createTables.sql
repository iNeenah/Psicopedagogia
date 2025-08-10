-- =====================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Clínica de Psicopedagogía y Psicología
-- =====================================================

-- Eliminar base de datos si existe (CUIDADO: esto borra todo)
-- DROP DATABASE IF EXISTS clinica_psicopedagogia;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS clinica_psicopedagogia 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE clinica_psicopedagogia;

-- =====================================================
-- TABLA 1: USUARIOS (Obligatoria)
-- =====================================================
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email único del usuario',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del usuario',
    apellido VARCHAR(50) NOT NULL COMMENT 'Apellido del usuario',
    telefono VARCHAR(20) COMMENT 'Teléfono de contacto',
    rol ENUM('profesional', 'paciente') NOT NULL COMMENT 'Rol del usuario en el sistema',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
) COMMENT 'Tabla principal de usuarios del sistema';

-- =====================================================
-- TABLA 2: PROFESIONALES
-- =====================================================
DROP TABLE IF EXISTS profesionales;

CREATE TABLE profesionales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL COMMENT 'Referencia al usuario',
    matricula VARCHAR(20) UNIQUE NOT NULL COMMENT 'Matrícula profesional única',
    especialidad ENUM('psicologo', 'psicopedagogo', 'ambos') NOT NULL COMMENT 'Especialidad del profesional',
    anos_experiencia INT DEFAULT 0 COMMENT 'Años de experiencia profesional',
    tarifa_sesion DECIMAL(10,2) COMMENT 'Tarifa por sesión en pesos',
    horario_inicio TIME DEFAULT '09:00:00' COMMENT 'Hora de inicio de atención',
    horario_fin TIME DEFAULT '18:00:00' COMMENT 'Hora de fin de atención',
    dias_atencion SET('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado') 
        DEFAULT 'lunes,martes,miercoles,jueves,viernes' COMMENT 'Días de atención',
    biografia TEXT COMMENT 'Biografía profesional',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_matricula (matricula),
    INDEX idx_especialidad (especialidad)
) COMMENT 'Información específica de profesionales';

-- =====================================================
-- TABLA 3: PACIENTES
-- =====================================================
DROP TABLE IF EXISTS pacientes;

CREATE TABLE pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL COMMENT 'Referencia al usuario',
    fecha_nacimiento DATE NOT NULL COMMENT 'Fecha de nacimiento del paciente',
    edad INT GENERATED ALWAYS AS (YEAR(CURDATE()) - YEAR(fecha_nacimiento)) STORED COMMENT 'Edad calculada automáticamente',
    motivo_consulta TEXT NOT NULL COMMENT 'Motivo principal de la consulta',
    derivado_por VARCHAR(100) COMMENT 'Quién derivó al paciente',
    obra_social VARCHAR(100) COMMENT 'Obra social del paciente',
    numero_afiliado VARCHAR(50) COMMENT 'Número de afiliado',
    responsable_nombre VARCHAR(100) COMMENT 'Nombre del responsable (si es menor)',
    responsable_telefono VARCHAR(20) COMMENT 'Teléfono del responsable',
    responsable_email VARCHAR(100) COMMENT 'Email del responsable',
    observaciones TEXT COMMENT 'Observaciones adicionales',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_edad (edad),
    INDEX idx_obra_social (obra_social)
) COMMENT 'Información específica de pacientes';

-- =====================================================
-- TABLA 4: SESIONES
-- =====================================================
DROP TABLE IF EXISTS sesiones;

CREATE TABLE sesiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL COMMENT 'ID del paciente',
    profesional_id INT NOT NULL COMMENT 'ID del profesional',
    fecha_hora DATETIME NOT NULL COMMENT 'Fecha y hora de la sesión',
    duracion_minutos INT DEFAULT 50 COMMENT 'Duración en minutos',
    tipo_sesion ENUM('evaluacion', 'tratamiento', 'seguimiento', 'interconsulta') NOT NULL COMMENT 'Tipo de sesión',
    estado ENUM('programada', 'realizada', 'cancelada', 'no_asistio') DEFAULT 'programada' COMMENT 'Estado de la sesión',
    notas_sesion TEXT COMMENT 'Notas de la sesión',
    observaciones TEXT COMMENT 'Observaciones adicionales',
    costo DECIMAL(10,2) COMMENT 'Costo de la sesión',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id) ON DELETE CASCADE,
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_paciente_profesional (paciente_id, profesional_id),
    INDEX idx_estado (estado),
    INDEX idx_tipo_sesion (tipo_sesion)
) COMMENT 'Sesiones entre profesionales y pacientes';

-- =====================================================
-- TABLA 5: EVALUACIONES
-- =====================================================
DROP TABLE IF EXISTS evaluaciones;

CREATE TABLE evaluaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL COMMENT 'ID del paciente evaluado',
    profesional_id INT NOT NULL COMMENT 'ID del profesional que evalúa',
    sesion_id INT COMMENT 'ID de la sesión relacionada (opcional)',
    fecha_evaluacion DATE NOT NULL COMMENT 'Fecha de la evaluación',
    tipo_evaluacion ENUM('inicial', 'seguimiento', 'final', 'neuropsicologica', 'psicopedagogica') NOT NULL COMMENT 'Tipo de evaluación',
    area_evaluada SET('cognitiva', 'emocional', 'conductual', 'academica', 'social', 'familiar') NOT NULL COMMENT 'Áreas evaluadas',
    instrumentos_utilizados TEXT COMMENT 'Instrumentos y tests utilizados',
    resultados TEXT NOT NULL COMMENT 'Resultados de la evaluación',
    interpretacion TEXT COMMENT 'Interpretación de los resultados',
    recomendaciones TEXT COMMENT 'Recomendaciones terapéuticas',
    objetivos_terapeuticos TEXT COMMENT 'Objetivos del tratamiento',
    archivo_adjunto VARCHAR(255) COMMENT 'Ruta del archivo adjunto',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_id) REFERENCES sesiones(id) ON DELETE SET NULL,
    INDEX idx_paciente_fecha (paciente_id, fecha_evaluacion),
    INDEX idx_tipo_evaluacion (tipo_evaluacion),
    INDEX idx_fecha_evaluacion (fecha_evaluacion)
) COMMENT 'Evaluaciones y seguimientos de pacientes';

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (email, password, nombre, apellido, telefono, rol) VALUES
('dr.martinez@clinica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Martínez', '11-1234-5678', 'profesional'),
('dra.lopez@clinica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'López', '11-1234-5679', 'profesional'),
('dra.rodriguez@clinica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Laura', 'Rodríguez', '11-1234-5680', 'profesional'),
('maria.gonzalez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'González', '11-9876-5432', 'paciente'),
('juan.perez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Pérez', '11-9876-5433', 'paciente'),
('sofia.martinez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sofía', 'Martínez', '11-9876-5434', 'paciente');

-- Insertar profesionales de ejemplo
INSERT INTO profesionales (usuario_id, matricula, especialidad, anos_experiencia, tarifa_sesion, biografia) VALUES
(1, 'PSI-001', 'psicologo', 10, 5000.00, 'Psicólogo especializado en terapia cognitivo-conductual con 10 años de experiencia en el tratamiento de trastornos de ansiedad y depresión.'),
(2, 'PSP-002', 'psicopedagogo', 8, 4500.00, 'Psicopedagoga especializada en dificultades de aprendizaje y trastornos del neurodesarrollo. Experiencia en evaluación e intervención psicopedagógica.'),
(3, 'PSI-003', 'ambos', 12, 5500.00, 'Profesional con doble titulación en Psicología y Psicopedagogía. Especialista en evaluación neuropsicológica y rehabilitación cognitiva.');

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (usuario_id, fecha_nacimiento, motivo_consulta, derivado_por, obra_social, numero_afiliado, responsable_nombre, responsable_telefono, responsable_email) VALUES
(4, '2010-05-15', 'Dificultades de aprendizaje en matemáticas y problemas de atención en el aula escolar', 'Escuela Primaria San José', 'OSDE', '123456789', 'Carmen González', '11-9876-5435', 'carmen.gonzalez@email.com'),
(5, '2008-08-20', 'Problemas de atención y concentración, posible TDAH', 'Dr. Pediatra Juan Carlos Ruiz', 'Swiss Medical', '987654321', 'Roberto Pérez', '11-9876-5436', 'roberto.perez@email.com'),
(6, '2015-12-03', 'Evaluación del desarrollo del lenguaje y habilidades sociales', 'Centro de Estimulación Temprana', 'IOMA', '456789123', 'Patricia Martínez', '11-9876-5437', 'patricia.martinez@email.com');

-- Insertar sesiones de ejemplo
INSERT INTO sesiones (paciente_id, profesional_id, fecha_hora, tipo_sesion, estado, notas_sesion, costo) VALUES
(1, 2, '2024-02-15 10:00:00', 'evaluacion', 'realizada', 'Primera sesión de evaluación psicopedagógica. El paciente mostró buena disposición y colaboración.', 4500.00),
(1, 2, '2024-02-22 10:00:00', 'seguimiento', 'programada', NULL, 4500.00),
(2, 1, '2024-02-16 14:00:00', 'evaluacion', 'realizada', 'Evaluación inicial para descartar TDAH. Se aplicaron pruebas de atención y concentración.', 5000.00),
(3, 3, '2024-02-17 09:00:00', 'evaluacion', 'programada', NULL, 5500.00);

-- Insertar evaluaciones de ejemplo
INSERT INTO evaluaciones (paciente_id, profesional_id, sesion_id, fecha_evaluacion, tipo_evaluacion, area_evaluada, instrumentos_utilizados, resultados, interpretacion, recomendaciones, objetivos_terapeuticos) VALUES
(1, 2, 1, '2024-02-15', 'inicial', 'cognitiva,academica', 'WISC-V, Test de Bender, Evaluación de habilidades matemáticas', 'El paciente presenta dificultades específicas en el procesamiento de información matemática, especialmente en operaciones que requieren memoria de trabajo. Comprensión verbal dentro de la normalidad.', 'Los resultados sugieren un perfil compatible con dificultades específicas del aprendizaje en el área matemática (discalculia).', 'Intervención psicopedagógica específica para matemáticas, estrategias de apoyo en el aula, seguimiento trimestral.', '1. Mejorar estrategias de cálculo mental, 2. Desarrollar habilidades de resolución de problemas matemáticos, 3. Fortalecer la autoestima académica'),
(2, 1, 3, '2024-02-16', 'neuropsicologica', 'cognitiva,conductual', 'WISC-V, Test de Atención Sostenida, Escala Conners', 'Se observan dificultades significativas en atención sostenida y control inhibitorio. Hiperactividad moderada. Funciones ejecutivas por debajo del promedio esperado.', 'El perfil neuropsicológico es compatible con Trastorno por Déficit de Atención e Hiperactividad (TDAH) de tipo combinado.', 'Derivación a psiquiatra infantil para evaluación farmacológica, terapia cognitivo-conductual, estrategias de manejo conductual en casa y escuela.', '1. Mejorar capacidad de atención sostenida, 2. Desarrollar estrategias de autocontrol, 3. Reducir comportamientos disruptivos');

-- =====================================================
-- VERIFICACIÓN DE DATOS
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
    u.activo
FROM usuarios u
ORDER BY u.rol, u.apellido;

-- Ver profesionales con información completa
SELECT 
    p.id,
    CONCAT(u.nombre, ' ', u.apellido) as profesional,
    p.matricula,
    p.especialidad,
    p.anos_experiencia,
    p.tarifa_sesion
FROM profesionales p
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.activo = TRUE;

-- Ver pacientes con información básica
SELECT 
    pac.id,
    CONCAT(u.nombre, ' ', u.apellido) as paciente,
    pac.edad,
    pac.motivo_consulta,
    pac.obra_social
FROM pacientes pac
JOIN usuarios u ON pac.usuario_id = u.id
WHERE pac.activo = TRUE;

-- =====================================================
-- SCRIPT COMPLETADO EXITOSAMENTE
-- =====================================================

SELECT '✅ Base de datos creada exitosamente!' as Mensaje;