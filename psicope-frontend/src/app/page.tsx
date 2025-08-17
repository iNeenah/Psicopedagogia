'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // Redirect automáticamente si ya está logueado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56"
        >
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-8">
            <div className="mx-auto h-20 w-20 flex items-center justify-center bg-blue-600 rounded-2xl mb-8 shadow-lg">
              <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                <span className="text-blue-600">PsicoPe</span>{' '}
                <br className="sm:hidden" />
                Clínica Digital
              </h1>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Sistema integral de gestión para clínicas de psicopedagogía y psicología. 
              Gestiona pacientes, sesiones, evaluaciones y más con tecnología moderna.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link href="/auth/login">
                <Button size="lg" className="px-8">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="px-8">
                  Registrarse
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mx-auto max-w-7xl px-6 lg:px-8 pb-24"
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Funcionalidades</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Todo lo que necesitas en un solo lugar
            </p>
          </div>
          <div className="mx-auto max-w-2xl sm:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="glass-effect p-6 rounded-xl"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    name: 'Gestión de Pacientes',
    description: 'Administra la información completa de tus pacientes con historiales detallados.',
    icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  {
    name: 'Calendario Inteligente',
    description: 'Programa y gestiona citas con un sistema de calendario avanzado.',
    icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    name: 'Evaluaciones Digitales',
    description: 'Crea, gestiona y almacena evaluaciones psicológicas de forma segura.',
    icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    name: 'Estadísticas Avanzadas',
    description: 'Obtén insights detallados sobre tu práctica con reportes automáticos.',
    icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    name: 'Seguridad Garantizada',
    description: 'Protege la información sensible con encriptación de nivel empresarial.',
    icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    name: 'Acceso Multiplataforma',
    description: 'Accede desde cualquier dispositivo: web, móvil o tablet.',
    icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }
]
