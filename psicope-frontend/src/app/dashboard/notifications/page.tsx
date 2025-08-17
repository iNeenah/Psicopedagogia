'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BellIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'

type NotificationTypes = 
  | 'appointment' 
  | 'patient' 
  | 'evaluation' 
  | 'payment' 
  | 'system' 
  | 'reminder'

interface Notification {
  id: string
  type: NotificationTypes
  title: string
  message: string
  createdAt: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
}

// Datos de ejemplo
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Nueva cita programada',
    message: 'Maria González ha programado una cita para el 15 de diciembre a las 10:00 AM',
    createdAt: '2024-12-10T14:30:00',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Recordatorio de sesión',
    message: 'Sesión con Carlos Rodríguez en 30 minutos (3:30 PM)',
    createdAt: '2024-12-10T14:00:00',
    read: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'evaluation',
    title: 'Evaluación completada',
    message: 'Ana Pérez ha completado su evaluación psicopedagógica',
    createdAt: '2024-12-10T10:15:00',
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'payment',
    title: 'Pago recibido',
    message: 'Pago de $2,000 recibido de Pedro Martínez',
    createdAt: '2024-12-09T16:45:00',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'patient',
    title: 'Nuevo paciente registrado',
    message: 'Laura Hernández se ha registrado como nuevo paciente',
    createdAt: '2024-12-09T11:20:00',
    read: false,
    priority: 'medium'
  },
  {
    id: '6',
    type: 'system',
    title: 'Actualización del sistema',
    message: 'Nueva versión disponible con mejoras de seguridad',
    createdAt: '2024-12-08T09:00:00',
    read: true,
    priority: 'low'
  }
]

const notificationIcons = {
  appointment: CalendarIcon,
  patient: UserGroupIcon,
  evaluation: DocumentTextIcon,
  payment: CurrencyDollarIcon,
  system: AdjustmentsHorizontalIcon,
  reminder: ExclamationTriangleIcon
}

const priorityColors = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-blue-500 bg-blue-50'
}

const typeColors = {
  appointment: 'text-blue-600 bg-blue-100',
  patient: 'text-green-600 bg-green-100',
  evaluation: 'text-purple-600 bg-purple-100',
  payment: 'text-orange-600 bg-orange-100',
  system: 'text-gray-600 bg-gray-100',
  reminder: 'text-red-600 bg-red-100'
}

export default function NotificationsPage() {
  const { isProfesional } = useRequireAuth()
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'high' | NotificationTypes>('all')

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'all':
        return true
      case 'unread':
        return !notification.read
      case 'high':
        return notification.priority === 'high'
      default:
        return notification.type === selectedFilter
    }
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Hace menos de 1 hora'
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-gray-600">
              Mantente al día con las actividades importantes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Marcar todo como leído
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-sm text-gray-600">Total notificaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                    <p className="text-sm text-gray-600">Sin leer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
                    <p className="text-sm text-gray-600">Alta prioridad</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Todas' },
                { value: 'unread', label: 'Sin leer' },
                { value: 'high', label: 'Alta prioridad' },
                { value: 'appointment', label: 'Citas' },
                { value: 'patient', label: 'Pacientes' },
                { value: 'evaluation', label: 'Evaluaciones' },
                { value: 'payment', label: 'Pagos' },
                { value: 'reminder', label: 'Recordatorios' },
                { value: 'system', label: 'Sistema' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value as any)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedFilter === filter.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay notificaciones para mostrar</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => {
              const IconComponent = notificationIcons[notification.type]
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-l-4 transition-all hover:shadow-md ${
                    priorityColors[notification.priority]
                  } ${
                    !notification.read ? 'shadow-sm' : 'opacity-75'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${typeColors[notification.type]}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium text-gray-900 ${
                                !notification.read ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                notification.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : notification.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {notification.priority === 'high' ? 'Alta' : 
                                 notification.priority === 'medium' ? 'Media' : 'Baja'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-4">
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                Marcar como leída
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
