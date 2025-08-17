'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface UseAuthOptions {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useAuth({ redirectTo = '/auth/login', redirectIfFound = false }: UseAuthOptions = {}) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      // Si está autenticado pero debería redirigir cuando está logueado
      if (isAuthenticated && redirectIfFound) {
        router.push('/dashboard')
      }
      // Si no está autenticado y debería estar
      else if (!isAuthenticated && !redirectIfFound) {
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, isLoading, redirectTo, redirectIfFound, router])

  // Verificar auth al montar
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    isAuthenticated,
    isLoading,
    isProfesional: user?.rol === 'profesional',
    isPaciente: user?.rol === 'paciente'
  }
}

export function useRequireAuth() {
  return useAuth({ redirectTo: '/auth/login' })
}

export function useGuestOnly() {
  return useAuth({ redirectTo: '/dashboard', redirectIfFound: true })
}
