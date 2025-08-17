'use client'

import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Datos de ejemplo para los gráficos
const sessionData = [
  { name: 'Ene', sesiones: 12, ingresos: 24000 },
  { name: 'Feb', sesiones: 15, ingresos: 30000 },
  { name: 'Mar', sesiones: 18, ingresos: 36000 },
  { name: 'Abr', sesiones: 22, ingresos: 44000 },
  { name: 'May', sesiones: 25, ingresos: 50000 },
  { name: 'Jun', sesiones: 28, ingresos: 56000 },
]

const evaluationTypes = [
  { name: 'Inicial', value: 35, color: '#3B82F6' },
  { name: 'Seguimiento', value: 45, color: '#10B981' },
  { name: 'Final', value: 15, color: '#F59E0B' },
  { name: 'Reevaluación', value: 5, color: '#EF4444' },
]

export default function DashboardPage() {
  const { user, isProfesional, isPaciente } = useRequireAuth()

  const profesionalStats = [
    {
      name: 'Pacientes Activos',
      value: '24',
      change: '+12%',
      changeType: 'increase' as const,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Sesiones Este Mes',
      value: '28',
      change: '+8%',
      changeType: 'increase' as const,
      icon: CalendarDaysIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Evaluaciones Realizadas',
      value: '15',
      change: '+15%',
      changeType: 'increase' as const,
      icon: DocumentTextIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Ingresos del Mes',
      value: '$56,000',
      change: '+18%',
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-orange-500'
    }
  ]

  const pacienteStats = [
    {
      name: 'Próxima Sesión',
      value: '2 días',
      change: 'Lunes 10:00',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Sesiones Completadas',
      value: '12',
      change: '+2 este mes',
      changeType: 'increase' as const,
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Evaluaciones',
      value: '3',
      change: 'Última: Hace 2 semanas',
      changeType: 'neutral' as const,
      icon: DocumentTextIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Tiempo en Tratamiento',
      value: '6 meses',
      change: 'Progreso excelente',
      changeType: 'increase' as const,
      icon: CalendarDaysIcon,
      color: 'bg-orange-500'
    }
  ]

  const stats = isProfesional ? profesionalStats : pacienteStats

  const recentActivities = [
    {
      id: 1,
      type: 'session',
      title: 'Sesión completada',
      description: 'Sesión con María González',
      time: 'Hace 2 horas',
      icon: CalendarDaysIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      type: 'evaluation',
      title: 'Nueva evaluación',
      description: 'Evaluación inicial de Juan Pérez',
      time: 'Hace 5 horas',
      icon: DocumentTextIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Cita programada',
      description: 'Sesión para mañana 14:00',
      time: 'Hace 1 día',
      icon: ClockIcon,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      patient: isProfesional ? 'María González' : 'Dr. Martínez',
      time: '10:00 AM',
      date: 'Hoy',
      type: 'Sesión de seguimiento',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: isProfesional ? 'Carlos Rodríguez' : 'Dra. López',
      time: '2:30 PM',
      date: 'Mañana',
      type: 'Evaluación inicial',
      status: 'pending'
    },
    {
      id: 3,
      patient: isProfesional ? 'Ana Martín' : 'Dr. García',
      time: '11:15 AM',
      date: '25 Nov',
      type: 'Terapia cognitiva',
      status: 'confirmed'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
        >
          <h1 className="text-2xl font-bold mb-2">
            ¡Bienvenido de vuelta, {user?.nombre}! 👋
          </h1>
          <p className="text-blue-100">
            {isProfesional 
              ? 'Tienes 3 sesiones programadas para hoy y 2 evaluaciones pendientes.'
              : 'Tu próxima sesión es mañana a las 10:00 AM con Dr. Martínez.'
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.changeType === 'increase' && (
                          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        )}
                        {stat.changeType === 'decrease' && (
                          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${
                          stat.changeType === 'increase' ? 'text-green-600' : 
                          stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section - Solo para profesionales */}
        {isProfesional && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sesiones e Ingresos Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sessionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="sesiones" fill="#3B82F6" name="Sesiones" />
                      <Bar yAxisId="right" dataKey="ingresos" fill="#10B981" name="Ingresos ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Evaluaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={evaluationTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {evaluationTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Próximas Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {appointment.patient}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.time}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {appointment.date}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
