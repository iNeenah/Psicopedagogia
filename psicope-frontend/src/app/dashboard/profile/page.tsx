'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  PencilIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CakeIcon,
  IdentificationIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { showToast } from '@/utils/toast'

interface PatientProfile {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaNacimiento: string
  direccion: string
  contactoEmergencia: {
    nombre: string
    telefono: string
    relacion: string
  }
  profesional: {
    nombre: string
    especialidad: string
    telefono: string
    email: string
  }
  estadoTratamiento: 'activo' | 'pausa' | 'finalizado'
  fechaIngreso: string
  proximaCita: {
    fecha: string
    hora: string
    tipo: string
  } | null
  sesionesCompletadas: number
  sesionesTotales: number
  evaluacionesRealizadas: number
  motivoConsulta: string
  alergias: string[]
  medicamentos: string[]
  observacionesGenerales: string
}

// Datos de ejemplo
const sampleProfile: PatientProfile = {
  id: '1',
  nombre: 'Ana',
  apellido: 'García',
  email: 'ana.garcia@email.com',
  telefono: '+52 55 1234 5678',
  fechaNacimiento: '1995-03-15',
  direccion: 'Calle Principal 123, Col. Centro, Ciudad de México',
  contactoEmergencia: {
    nombre: 'María García',
    telefono: '+52 55 8765 4321',
    relacion: 'Madre'
  },
  profesional: {
    nombre: 'Dr. Carlos Rodríguez',
    especialidad: 'Psicopedagogía',
    telefono: '+52 55 9876 5432',
    email: 'carlos.rodriguez@psicope.com'
  },
  estadoTratamiento: 'activo',
  fechaIngreso: '2024-01-15',
  proximaCita: {
    fecha: '2024-12-15',
    hora: '10:00',
    tipo: 'Seguimiento'
  },
  sesionesCompletadas: 8,
  sesionesTotales: 12,
  evaluacionesRealizadas: 2,
  motivoConsulta: 'Dificultades de aprendizaje y concentración',
  alergias: ['Polen', 'Ácaros'],
  medicamentos: ['Vitamina D', 'Omega 3'],
  observacionesGenerales: 'Paciente colaborativa y comprometida con el tratamiento. Muestra avances significativos en las sesiones.'
}

export default function ProfilePage() {
  const { user } = useRequireAuth()
  const [profile, setProfile] = useState<PatientProfile>(sampleProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<PatientProfile>>(profile)

  if (user?.rol === 'profesional') {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p>Esta página es solo para pacientes.</p>
        </div>
      </DashboardLayout>
    )
  }

  const handleSave = () => {
    setProfile({ ...profile, ...editedProfile })
    setIsEditing(false)
    showToast.success('Perfil actualizado exitosamente')
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pausa': return 'bg-yellow-100 text-yellow-800'
      case 'finalizado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'activo': return 'Tratamiento Activo'
      case 'pausa': return 'Tratamiento en Pausa'
      case 'finalizado': return 'Tratamiento Finalizado'
      default: return 'Sin definir'
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const progressPercentage = (profile.sesionesCompletadas / profile.sesionesTotales) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Información personal y estado del tratamiento
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                        Nombre
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.nombre || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, nombre: e.target.value})}
                          placeholder="Nombre"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.nombre}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                        Apellido
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.apellido || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, apellido: e.target.value})}
                          placeholder="Apellido"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.apellido}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2 flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        Correo Electrónico
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile.email || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          placeholder="correo@ejemplo.com"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2 flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" />
                        Teléfono
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.telefono || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, telefono: e.target.value})}
                          placeholder="+52 55 1234 5678"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.telefono}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2 flex items-center gap-2">
                        <CakeIcon className="h-4 w-4" />
                        Fecha de Nacimiento
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(profile.fechaNacimiento)} ({calculateAge(profile.fechaNacimiento)} años)
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2 flex items-center gap-2">
                        <IdentificationIcon className="h-4 w-4" />
                        Estado del Tratamiento
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profile.estadoTratamiento)}`}>
                        {getStatusText(profile.estadoTratamiento)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2 flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Dirección
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.direccion || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, direccion: e.target.value})}
                        placeholder="Calle, colonia, ciudad"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.direccion}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información Médica */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartIcon className="h-5 w-5 text-red-600" />
                    Información Médica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Motivo de Consulta
                    </label>
                    <p className="text-gray-900 dark:text-white">{profile.motivoConsulta}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                        Alergias
                      </label>
                      <div className="space-y-1">
                        {profile.alergias.length > 0 ? (
                          profile.alergias.map((alergia, index) => (
                            <span key={index} className="inline-block bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full mr-2">
                              {alergia}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">Sin alergias conocidas</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                        Medicamentos
                      </label>
                      <div className="space-y-1">
                        {profile.medicamentos.length > 0 ? (
                          profile.medicamentos.map((medicamento, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full mr-2">
                              {medicamento}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">Sin medicamentos</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Observaciones Generales
                    </label>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {profile.observacionesGenerales}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progreso del Tratamiento */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Progreso del Tratamiento</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
                        className="text-blue-600 transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {profile.sesionesCompletadas} de {profile.sesionesTotales} sesiones
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {profile.evaluacionesRealizadas} evaluaciones completadas
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Próxima Cita */}
            {profile.proximaCita && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                      Próxima Cita
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(profile.proximaCita.fecha)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        {profile.proximaCita.hora}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tipo: {profile.proximaCita.tipo}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mi Profesional */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-purple-600" />
                    Mi Profesional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.profesional.nombre}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{profile.profesional.especialidad}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {profile.profesional.telefono}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      {profile.profesional.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contacto de Emergencia */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Contacto de Emergencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.contactoEmergencia.nombre}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profile.contactoEmergencia.relacion}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    {profile.contactoEmergencia.telefono}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
