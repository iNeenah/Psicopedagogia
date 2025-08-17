'use client'

import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: ('profesional' | 'paciente')[]
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
  { 
    name: 'Pacientes', 
    href: '/dashboard/patients', 
    icon: UserGroupIcon,
    roles: ['profesional']
  },
  { 
    name: 'Mi Perfil', 
    href: '/dashboard/profile', 
    icon: UserGroupIcon,
    roles: ['paciente']
  },
  { 
    name: 'Calendario', 
    href: '/dashboard/calendar', 
    icon: CalendarDaysIcon,
    badge: 3
  },
  { 
    name: 'Evaluaciones', 
    href: '/dashboard/evaluations', 
    icon: DocumentTextIcon 
  },
  { 
    name: 'Estadísticas', 
    href: '/dashboard/statistics', 
    icon: ChartBarIcon,
    roles: ['profesional']
  },
  { 
    name: 'Configuración', 
    href: '/dashboard/settings', 
    icon: CogIcon 
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useSettingsStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(nextTheme)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return SunIcon
      case 'dark':
        return MoonIcon
      case 'system':
        return ComputerDesktopIcon
      default:
        return SunIcon
    }
  }

  // Filtrar navegación por rol
  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.rol as any)
  )

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.3 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform lg:translate-x-0 lg:static lg:inset-0 transition-colors",
          "lg:flex lg:flex-col"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">PsicoPe</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                )} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User menu */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {user?.rol}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 justify-between">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {pathname === '/dashboard' ? 'Dashboard' :
                 pathname.includes('/patients') ? 'Pacientes' :
                 pathname.includes('/calendar') ? 'Calendario' :
                 pathname.includes('/evaluations') ? 'Evaluaciones' :
                 pathname.includes('/statistics') ? 'Estadísticas' :
                 pathname.includes('/notifications') ? 'Notificaciones' :
                 pathname.includes('/profile') ? 'Mi Perfil' :
                 pathname.includes('/settings') ? 'Configuración' : 'PsicoPe'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={cycleTheme}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Tema actual: ${theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Oscuro'}`}
              >
                {(() => {
                  const ThemeIcon = getThemeIcon()
                  return <ThemeIcon className="h-5 w-5" />
                })()}
              </button>
              <Link href="/dashboard/notifications">
                <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
