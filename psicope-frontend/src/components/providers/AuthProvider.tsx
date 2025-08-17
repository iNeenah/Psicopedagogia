'use client'

import { useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    checkAuth()
  }, [checkAuth])

  // Mostrar loading durante la verificación inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
