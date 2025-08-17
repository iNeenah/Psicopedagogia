// Tipos de usuario y autenticación
export interface User {
  id: number
  email: string
  nombre: string
  apellido: string
  telefono?: string
  rol: 'profesional' | 'paciente'
  activo: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nombre: string
  apellido: string
  telefono?: string
  rol: 'profesional' | 'paciente'
}

// Tipos de profesional
export interface Profesional {
  id: number
  user_id: number
  matricula: string
  especialidad: 'psicologo' | 'psicopedagogo' | 'ambos'
  anos_experiencia: number
  tarifa_por_hora: number
  bio?: string
  activo: boolean
  created_at: string
  updated_at: string
  usuario?: User
}

// Tipos de paciente
export interface Paciente {
  id: number
  user_id: number
  fecha_nacimiento: string
  motivo_consulta: string
  responsable_nombre?: string
  responsable_telefono?: string
  responsable_email?: string
  activo: boolean
  created_at: string
  updated_at: string
  usuario?: User
}

// Tipos de sesión
export interface Sesion {
  id: number
  paciente_id: number
  profesional_id: number
  fecha_hora: string
  duracion_minutos: number
  tipo_sesion: 'consulta' | 'evaluacion' | 'seguimiento' | 'terapia'
  estado: 'programada' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio'
  notas?: string
  costo: number
  created_at: string
  updated_at: string
  paciente?: Paciente
  profesional?: Profesional
}

// Tipos de evaluación
export interface Evaluacion {
  id: number
  paciente_id: number
  profesional_id: number
  tipo_evaluacion: 'inicial' | 'seguimiento' | 'final' | 'reevaluacion'
  fecha_evaluacion: string
  areas_evaluadas: string[]
  resultados: string
  recomendaciones?: string
  proxima_evaluacion?: string
  created_at: string
  updated_at: string
  paciente?: Paciente
  profesional?: Profesional
}

// Tipos de estadísticas
export interface EstadisticasProfesional {
  total_pacientes: number
  total_sesiones: number
  sesiones_mes_actual: number
  sesiones_pendientes: number
  ingresos_mes_actual: number
  ingresos_total: number
  evaluaciones_realizadas: number
}

export interface EstadisticasPaciente {
  total_sesiones: number
  ultima_sesion?: string
  proxima_sesion?: string
  evaluaciones_realizadas: number
  tiempo_en_tratamiento: number
}

// Tipos de respuestas API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos de formularios
export interface SesionForm {
  paciente_id: number
  profesional_id: number
  fecha_hora: string
  duracion_minutos: number
  tipo_sesion: string
  notas?: string
  costo: number
}

export interface EvaluacionForm {
  paciente_id: number
  profesional_id: number
  tipo_evaluacion: string
  fecha_evaluacion: string
  areas_evaluadas: string[]
  resultados: string
  recomendaciones?: string
  proxima_evaluacion?: string
}

// Tipos de navegación
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
  badge?: number
}

// Tipos de notificaciones
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Tipos de dashboard
export interface DashboardStats {
  label: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon?: React.ComponentType<{ className?: string }>
}

// Tipos de calendario
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'sesion' | 'evaluacion' | 'consulta'
  status: string
  paciente?: Paciente
  profesional?: Profesional
}
