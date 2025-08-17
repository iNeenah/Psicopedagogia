import axios from 'axios'
import type { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData,
  User,
  Profesional,
  Paciente,
  Sesion,
  Evaluacion 
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData)
    return data
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/profile')
    return data
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
    const { data } = await api.post<ApiResponse>('/auth/change-password', {
      oldPassword,
      newPassword
    })
    return data
  },

  verify: async (): Promise<ApiResponse> => {
    const { data } = await api.get<ApiResponse>('/auth/verify')
    return data
  }
}

// Usuarios API
export const usuariosApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await api.get<ApiResponse<User[]>>('/usuarios')
    return data
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const { data } = await api.get<ApiResponse<User>>(`/usuarios/${id}`)
    return data
  },

  update: async (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const { data } = await api.put<ApiResponse<User>>(`/usuarios/${id}`, userData)
    return data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const { data } = await api.delete<ApiResponse>(`/usuarios/${id}`)
    return data
  }
}

// Profesionales API
export const profesionalesApi = {
  create: async (profesionalData: Omit<Profesional, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Profesional>> => {
    const { data } = await api.post<ApiResponse<Profesional>>('/profesionales', profesionalData)
    return data
  },

  getAll: async (): Promise<ApiResponse<Profesional[]>> => {
    const { data } = await api.get<ApiResponse<Profesional[]>>('/profesionales')
    return data
  },

  getById: async (id: number): Promise<ApiResponse<Profesional>> => {
    const { data } = await api.get<ApiResponse<Profesional>>(`/profesionales/${id}`)
    return data
  },

  getByUserId: async (userId: number): Promise<ApiResponse<Profesional>> => {
    const { data } = await api.get<ApiResponse<Profesional>>(`/profesionales/user/${userId}`)
    return data
  },

  getEstadisticas: async (id: number): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`/profesionales/${id}/estadisticas`)
    return data
  },

  update: async (id: number, profesionalData: Partial<Profesional>): Promise<ApiResponse<Profesional>> => {
    const { data } = await api.put<ApiResponse<Profesional>>(`/profesionales/${id}`, profesionalData)
    return data
  }
}

// Pacientes API
export const pacientesApi = {
  create: async (pacienteData: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Paciente>> => {
    const { data } = await api.post<ApiResponse<Paciente>>('/pacientes', pacienteData)
    return data
  },

  getAll: async (): Promise<ApiResponse<Paciente[]>> => {
    const { data } = await api.get<ApiResponse<Paciente[]>>('/pacientes')
    return data
  },

  getById: async (id: number): Promise<ApiResponse<Paciente>> => {
    const { data } = await api.get<ApiResponse<Paciente>>(`/pacientes/${id}`)
    return data
  },

  getByUserId: async (userId: number): Promise<ApiResponse<Paciente>> => {
    const { data } = await api.get<ApiResponse<Paciente>>(`/pacientes/user/${userId}`)
    return data
  },

  getHistorial: async (id: number): Promise<ApiResponse<any[]>> => {
    const { data } = await api.get<ApiResponse<any[]>>(`/pacientes/${id}/historial`)
    return data
  },

  getEstadisticas: async (id: number): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`/pacientes/${id}/estadisticas`)
    return data
  },

  update: async (id: number, pacienteData: Partial<Paciente>): Promise<ApiResponse<Paciente>> => {
    const { data } = await api.put<ApiResponse<Paciente>>(`/pacientes/${id}`, pacienteData)
    return data
  }
}

// Sesiones API
export const sesionesApi = {
  create: async (sesionData: Omit<Sesion, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Sesion>> => {
    const { data } = await api.post<ApiResponse<Sesion>>('/sesiones', sesionData)
    return data
  },

  getAll: async (): Promise<ApiResponse<Sesion[]>> => {
    const { data } = await api.get<ApiResponse<Sesion[]>>('/sesiones')
    return data
  },

  getById: async (id: number): Promise<ApiResponse<Sesion>> => {
    const { data } = await api.get<ApiResponse<Sesion>>(`/sesiones/${id}`)
    return data
  },

  getProximas: async (): Promise<ApiResponse<Sesion[]>> => {
    const { data } = await api.get<ApiResponse<Sesion[]>>('/sesiones/proximas')
    return data
  },

  getEstadisticas: async (): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>('/sesiones/estadisticas')
    return data
  },

  update: async (id: number, sesionData: Partial<Sesion>): Promise<ApiResponse<Sesion>> => {
    const { data } = await api.put<ApiResponse<Sesion>>(`/sesiones/${id}`, sesionData)
    return data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const { data } = await api.delete<ApiResponse>(`/sesiones/${id}`)
    return data
  }
}

// Evaluaciones API
export const evaluacionesApi = {
  create: async (evaluacionData: Omit<Evaluacion, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Evaluacion>> => {
    const { data } = await api.post<ApiResponse<Evaluacion>>('/evaluaciones', evaluacionData)
    return data
  },

  getAll: async (): Promise<ApiResponse<Evaluacion[]>> => {
    const { data } = await api.get<ApiResponse<Evaluacion[]>>('/evaluaciones')
    return data
  },

  getById: async (id: number): Promise<ApiResponse<Evaluacion>> => {
    const { data } = await api.get<ApiResponse<Evaluacion>>(`/evaluaciones/${id}`)
    return data
  },

  getByPaciente: async (pacienteId: number): Promise<ApiResponse<Evaluacion[]>> => {
    const { data } = await api.get<ApiResponse<Evaluacion[]>>(`/evaluaciones/paciente/${pacienteId}`)
    return data
  },

  getByProfesional: async (profesionalId: number): Promise<ApiResponse<Evaluacion[]>> => {
    const { data } = await api.get<ApiResponse<Evaluacion[]>>(`/evaluaciones/profesional/${profesionalId}`)
    return data
  },

  update: async (id: number, evaluacionData: Partial<Evaluacion>): Promise<ApiResponse<Evaluacion>> => {
    const { data } = await api.put<ApiResponse<Evaluacion>>(`/evaluaciones/${id}`, evaluacionData)
    return data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const { data } = await api.delete<ApiResponse>(`/evaluaciones/${id}`)
    return data
  }
}
