'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  // Redirect si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const success = await login(formData)
    if (success) {
      router.push('/dashboard')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error cuando el usuario empieza a escribir
    if (error) {
      clearError()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-xl mb-4">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de PsicoPe
          </p>
        </div>

        {/* Formulario */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Bienvenido de vuelta</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error global */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  leftIcon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  leftIcon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Recordar y olvidar contraseña */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Recordarme</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de submit */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={!formData.email || !formData.password}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">o continúa con</span>
                </div>
              </div>
            </div>

            {/* Usuarios de prueba */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-center text-gray-600">
                Usuarios de prueba:
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-gray-100 rounded-md p-2">
                  <strong>Profesional:</strong> dr.martinez@clinica.com / password
                </div>
                <div className="bg-gray-100 rounded-md p-2">
                  <strong>Paciente:</strong> maria.gonzalez@email.com / password
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link de registro */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
