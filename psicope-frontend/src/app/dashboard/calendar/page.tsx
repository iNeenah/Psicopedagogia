'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'session' | 'evaluation' | 'consultation'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  patient?: string
  professional?: string
  notes?: string
}

// Eventos de ejemplo
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Sesión con María González',
    start: new Date(2024, 10, 20, 10, 0),
    end: new Date(2024, 10, 20, 11, 0),
    type: 'session',
    status: 'confirmed',
    patient: 'María González',
    notes: 'Sesión de seguimiento'
  },
  {
    id: '2',
    title: 'Evaluación inicial Juan Pérez',
    start: new Date(2024, 10, 21, 14, 30),
    end: new Date(2024, 10, 21, 16, 0),
    type: 'evaluation',
    status: 'scheduled',
    patient: 'Juan Pérez'
  },
  {
    id: '3',
    title: 'Consulta con Ana Martín',
    start: new Date(2024, 10, 22, 9, 0),
    end: new Date(2024, 10, 22, 10, 0),
    type: 'consultation',
    status: 'confirmed',
    patient: 'Ana Martín'
  }
]

export default function CalendarPage() {
  const { isProfesional } = useRequireAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [showEventModal, setShowEventModal] = useState(false)

  // Navegación del calendario
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Obtener días del mes para la vista de calendario
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { locale: es })
  const endDate = endOfWeek(monthEnd, { locale: es })
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date))
  }

  // Obtener color por tipo de evento
  const getEventColor = (type: CalendarEvent['type'], status: CalendarEvent['status']) => {
    const colors = {
      session: 'bg-blue-100 text-blue-800 border-blue-200',
      evaluation: 'bg-green-100 text-green-800 border-green-200',
      consultation: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    
    if (status === 'cancelled') {
      return 'bg-red-100 text-red-800 border-red-200'
    }
    
    return colors[type] || colors.session
  }

  const upcomingEvents = events
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
            <p className="text-gray-600">
              Gestiona tus citas y sesiones
            </p>
          </div>
          {isProfesional && (
            <Button onClick={() => setShowEventModal(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendario Principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-semibold">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                      </h2>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </CardTitle>
                  <div className="flex space-x-1">
                    {(['month', 'week', 'day'] as const).map((viewType) => (
                      <button
                        key={viewType}
                        onClick={() => setView(viewType)}
                        className={cn(
                          "px-3 py-1 text-sm rounded-md capitalize",
                          view === viewType 
                            ? "bg-blue-100 text-blue-600" 
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {viewType === 'month' ? 'Mes' : viewType === 'week' ? 'Semana' : 'Día'}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {view === 'month' && (
                  <div className="grid grid-cols-7 gap-1">
                    {/* Headers de días */}
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {/* Días del calendario */}
                    {days.map((day) => {
                      const dayEvents = getEventsForDate(day)
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const isDayToday = isToday(day)
                      const isSelected = selectedDate && isSameDay(day, selectedDate)

                      return (
                        <motion.div
                          key={day.toISOString()}
                          whileHover={{ scale: 1.02 }}
                          className={cn(
                            "min-h-[100px] p-2 border border-gray-200 cursor-pointer",
                            !isCurrentMonth && "text-gray-400 bg-gray-50",
                            isDayToday && "bg-blue-50 border-blue-200",
                            isSelected && "bg-blue-100 border-blue-300"
                          )}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className={cn(
                            "text-sm font-medium mb-1",
                            isDayToday && "text-blue-600"
                          )}>
                            {format(day, 'd')}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={cn(
                                  "text-xs p-1 rounded border truncate",
                                  getEventColor(event.type, event.status)
                                )}
                                title={`${event.title} - ${format(event.start, 'HH:mm')}`}
                              >
                                {format(event.start, 'HH:mm')} {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayEvents.length - 2} más
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Próximas Citas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {event.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(event.start, 'dd MMM, HH:mm', { locale: es })}
                          </p>
                          {event.notes && (
                            <p className="text-xs text-gray-600 mt-1">
                              {event.notes}
                            </p>
                          )}
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          event.status === 'confirmed' && "bg-green-100 text-green-800",
                          event.status === 'scheduled' && "bg-yellow-100 text-yellow-800",
                          event.status === 'completed' && "bg-blue-100 text-blue-800",
                          event.status === 'cancelled' && "bg-red-100 text-red-800"
                        )}>
                          {event.status === 'confirmed' && 'Confirmada'}
                          {event.status === 'scheduled' && 'Programada'}
                          {event.status === 'completed' && 'Completada'}
                          {event.status === 'cancelled' && 'Cancelada'}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <CalendarDaysIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay citas programadas</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estadísticas rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Este Mes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Citas</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completadas</span>
                  <span className="font-semibold text-green-600">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Canceladas</span>
                  <span className="font-semibold text-red-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pendientes</span>
                  <span className="font-semibold text-yellow-600">2</span>
                </div>
              </CardContent>
            </Card>

            {/* Leyenda de colores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tipos de Cita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-600">Sesiones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600">Evaluaciones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-xs text-gray-600">Consultas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
