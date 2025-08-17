import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<void>
  updateProfile: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.login(credentials)
          
          if (response.success) {
            localStorage.setItem('authToken', response.token)
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            return true
          } else {
            set({
              error: response.message || 'Error en el login',
              isLoading: false
            })
            return false
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.message || 'Error de conexión'
          set({
            error: errorMessage,
            isLoading: false
          })
          return false
        }
      },

      register: async (userData: RegisterData): Promise<boolean> => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.register(userData)
          
          if (response.success) {
            localStorage.setItem('authToken', response.token)
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            return true
          } else {
            set({
              error: response.message || 'Error en el registro',
              isLoading: false
            })
            return false
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.message || 'Error de conexión'
          set({
            error: errorMessage,
            isLoading: false
          })
          return false
        }
      },

      logout: () => {
        localStorage.removeItem('authToken')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },

      clearError: () => {
        set({ error: null })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('authToken')
        
        if (!token) {
          set({ isAuthenticated: false })
          return
        }

        set({ isLoading: true })
        
        try {
          await authApi.verify()
          const profileResponse = await authApi.getProfile()
          
          if (profileResponse.success && profileResponse.data) {
            set({
              user: profileResponse.data,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            // Token inválido o expirado
            localStorage.removeItem('authToken')
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            })
          }
        } catch (error) {
          // Token inválido o error de red
          localStorage.removeItem('authToken')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      },

      updateProfile: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      // Solo persistir ciertos campos
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
)
