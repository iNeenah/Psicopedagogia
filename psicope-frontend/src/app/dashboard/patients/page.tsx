'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface Patient {
  id: string
  nombre: string
  apellido: string
  edad: number
  telefono: string
  email: string
  fechaNacimiento: string
  motivoConsulta: string
  fechaIngreso: string
  sesionesCompletadas: number
  proximaSesion?: string
  estado: 'activo' | 'inactivo' | 'alta'
  responsable?: {
    nombre: string
    telefono: string
    email: string
    relacion: string
  }
  notas?: string
}

// Datos de ejemplo
const mockPatients: Patient[] = [
  {
    id: '1',
    nombre: 'María',
    apellido: 'González',
    edad: 28,
    telefono: '+54 11 1234-5678',
    email: 'maria.gonzalez@email.com',
    fechaNacimiento: '1995-03-15',
    motivoConsulta: 'Trastorno de ansiedad generalizada',
    fechaIngreso: '2024-01-15',
    sesionesCompletadas: 12,
    proximaSesion: '2024-11-25T10:00:00',
    estado: 'activo',
    notas: 'Paciente muy colaborativa, excelente progreso en las últimas sesiones.'
  },
  {
    id: '2',
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 8,
    telefono: '+54 11 9876-5432',
    email: 'juan.perez@email.com',
    fechaNacimiento: '2016-07-20',
    motivoConsulta: 'Dificultades de aprendizaje en matemáticas',
    fechaIngreso: '2024-02-20',
    sesionesCompletadas: 8,
    proximaSesion: '2024-11-26T15:30:00',
    estado: 'activo',
    responsable: {
      nombre: 'Ana Pérez',
      telefono: '+54 11 9876-5432',
      email: 'ana.perez@email.com',
      relacion: 'Madre'
    },
    notas: 'Niño con gran potencial, requiere refuerzo en conceptos básicos.'
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    edad: 35,
    telefono: '+54 11 5555-1234',
    email: 'carlos.rodriguez@email.com',
    fechaNacimiento: '1989-11-10',
    motivoConsulta: 'Terapia de pareja y comunicación',
    fechaIngreso: '2023-12-05',
    sesionesCompletadas: 18,
    estado: 'alta',
    notas: 'Tratamiento completado exitosamente. Alta por objetivos alcanzados.'
  }
]

export default function PatientsPage() {
  const { isProfesional } = useRequireAuth()
  const [patients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo' | 'alta'>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)

  if (!isProfesional) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </DashboardLayout>
    )
  }

  // Filtrar pacientes
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.motivoConsulta.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || patient.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (estado: Patient['estado']) => {
    const styles = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-blue-100 text-blue-800'
    }
    
    const labels = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      alta: 'Alta'
    }

    return (
      <span className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        styles[estado]
      )}>
        {labels[estado]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPatientStats = () => {
    return {
      total: patients.length,
      activos: patients.filter(p => p.estado === 'activo').length,
      altas: patients.filter(p => p.estado === 'alta').length,
      sesionesEsteMes: patients.reduce((acc, p) => acc + (p.sesionesCompletadas || 0), 0)
    }
  }

  const stats = getPatientStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
            <p className="text-gray-600">
              Gestiona la información y seguimiento de tus pacientes
            </p>
          </div>
          <Button onClick={() => setShowPatientModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Pacientes</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <UserIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Activos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Altas</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.altas}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sesiones del Mes</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.sesionesEsteMes}</p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar pacientes por nombre o motivo de consulta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </div>
              <div className="flex space-x-2">
                {['all', 'activo', 'inactivo', 'alta'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as any)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-md capitalize transition-colors",
                      statusFilter === status
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {status === 'all' ? 'Todos' : status}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Pacientes ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPatients.length > 0 ? (
              <div className="space-y-4">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {patient.nombre.charAt(0)}{patient.apellido.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {patient.nombre} {patient.apellido}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {patient.edad} años • Ingreso: {formatDate(patient.fechaIngreso)}
                            </p>
                          </div>
                          {getStatusBadge(patient.estado)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Motivo de consulta:</strong>
                            </p>
                            <p className="text-sm">{patient.motivoConsulta}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Contacto:</strong>
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                                {patient.telefono}
                              </span>
                              <span className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                                {patient.email}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              <strong>{patient.sesionesCompletadas}</strong> sesiones completadas
                            </span>
                            {patient.proximaSesion && (
                              <span>
                                Próxima: {formatDate(patient.proximaSesion)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <CalendarDaysIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <EllipsisVerticalIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {patient.responsable && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                            <p className="text-blue-800">
                              <strong>Responsable:</strong> {patient.responsable.nombre} ({patient.responsable.relacion})
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No se encontraron pacientes</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no tienes pacientes registrados'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
