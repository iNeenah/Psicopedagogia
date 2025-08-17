'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  PrinterIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface Evaluation {
  id: string
  paciente: {
    nombre: string
    apellido: string
    edad: number
  }
  profesional?: {
    nombre: string
    apellido: string
  }
  tipo: 'inicial' | 'seguimiento' | 'final' | 'reevaluacion'
  fecha: string
  areasEvaluadas: string[]
  estado: 'borrador' | 'completada' | 'revisada' | 'enviada'
  resultados?: string
  recomendaciones?: string
  proximaEvaluacion?: string
  documentos?: {
    nombre: string
    tipo: string
    url: string
  }[]
}

// Datos de ejemplo
const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    paciente: {
      nombre: 'María',
      apellido: 'González',
      edad: 28
    },
    tipo: 'inicial',
    fecha: '2024-11-15T10:00:00',
    areasEvaluadas: ['Ansiedad', 'Autoestima', 'Habilidades sociales'],
    estado: 'completada',
    resultados: 'La paciente presenta síntomas moderados de ansiedad generalizada con impacto significativo en su vida diaria. Se observa baja autoestima y algunas dificultades en habilidades sociales.',
    recomendaciones: 'Se recomienda terapia cognitivo-conductual con sesiones semanales. Implementar técnicas de relajación y mindfulness.',
    proximaEvaluacion: '2024-12-15T10:00:00',
    documentos: [
      { nombre: 'Informe_Maria_Gonzalez_Inicial.pdf', tipo: 'pdf', url: '#' },
      { nombre: 'Escala_Ansiedad_Beck.pdf', tipo: 'pdf', url: '#' }
    ]
  },
  {
    id: '2',
    paciente: {
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 8
    },
    tipo: 'seguimiento',
    fecha: '2024-11-20T15:30:00',
    areasEvaluadas: ['Atención', 'Matemáticas', 'Comprensión lectora'],
    estado: 'revisada',
    resultados: 'El niño muestra mejoras significativas en atención sostenida. Persisten algunas dificultades en operaciones matemáticas básicas.',
    recomendaciones: 'Continuar con ejercicios de atención. Reforzar conceptos matemáticos mediante juegos y actividades lúdicas.',
    proximaEvaluacion: '2024-12-20T15:30:00'
  },
  {
    id: '3',
    paciente: {
      nombre: 'Ana',
      apellido: 'Martín',
      edad: 45
    },
    tipo: 'final',
    fecha: '2024-11-10T11:00:00',
    areasEvaluadas: ['Depresión', 'Estrategias de afrontamiento', 'Relaciones interpersonales'],
    estado: 'enviada',
    resultados: 'Evolución muy favorable. La paciente ha desarrollado estrategias efectivas de afrontamiento y muestra una mejora significativa en su estado de ánimo.',
    recomendaciones: 'Se otorga el alta terapéutica. Se sugiere seguimiento mensual durante los próximos 3 meses.'
  }
]

export default function EvaluationsPage() {
  const { isProfesional } = useRequireAuth()
  const [evaluations] = useState<Evaluation[]>(mockEvaluations)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'inicial' | 'seguimiento' | 'final' | 'reevaluacion'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'borrador' | 'completada' | 'revisada' | 'enviada'>('all')

  // Filtrar evaluaciones
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = 
      evaluation.paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.areasEvaluadas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === 'all' || evaluation.tipo === typeFilter
    const matchesStatus = statusFilter === 'all' || evaluation.estado === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeBadge = (tipo: Evaluation['tipo']) => {
    const styles = {
      inicial: 'bg-blue-100 text-blue-800',
      seguimiento: 'bg-green-100 text-green-800',
      final: 'bg-purple-100 text-purple-800',
      reevaluacion: 'bg-orange-100 text-orange-800'
    }
    
    const labels = {
      inicial: 'Inicial',
      seguimiento: 'Seguimiento',
      final: 'Final',
      reevaluacion: 'Reevaluación'
    }

    return (
      <span className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        styles[tipo]
      )}>
        {labels[tipo]}
      </span>
    )
  }

  const getStatusBadge = (estado: Evaluation['estado']) => {
    const styles = {
      borrador: 'bg-gray-100 text-gray-800',
      completada: 'bg-blue-100 text-blue-800',
      revisada: 'bg-green-100 text-green-800',
      enviada: 'bg-purple-100 text-purple-800'
    }
    
    const labels = {
      borrador: 'Borrador',
      completada: 'Completada',
      revisada: 'Revisada',
      enviada: 'Enviada'
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

  const getEvaluationStats = () => {
    return {
      total: evaluations.length,
      completadas: evaluations.filter(e => e.estado === 'completada' || e.estado === 'revisada' || e.estado === 'enviada').length,
      pendientes: evaluations.filter(e => e.estado === 'borrador').length,
      esteMes: evaluations.filter(e => {
        const evalDate = new Date(e.fecha)
        const now = new Date()
        return evalDate.getMonth() === now.getMonth() && evalDate.getFullYear() === now.getFullYear()
      }).length
    }
  }

  const stats = getEvaluationStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
            <p className="text-gray-600">
              Gestiona y crea evaluaciones psicológicas
            </p>
          </div>
          {isProfesional && (
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completadas}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendientes}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Este Mes</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.esteMes}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar evaluaciones por paciente o área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex space-x-1">
                  <span className="text-sm text-gray-500 self-center mr-2">Tipo:</span>
                  {(['all', 'inicial', 'seguimiento', 'final', 'reevaluacion'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md capitalize transition-colors",
                        typeFilter === type
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {type === 'all' ? 'Todos' : type}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-1">
                  <span className="text-sm text-gray-500 self-center mr-2">Estado:</span>
                  {(['all', 'borrador', 'completada', 'revisada', 'enviada'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md capitalize transition-colors",
                        statusFilter === status
                          ? "bg-green-100 text-green-600"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {status === 'all' ? 'Todos' : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluations List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Evaluaciones ({filteredEvaluations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvaluations.length > 0 ? (
              <div className="space-y-4">
                {filteredEvaluations.map((evaluation, index) => (
                  <motion.div
                    key={evaluation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {evaluation.paciente.nombre} {evaluation.paciente.apellido}
                          </h3>
                          {getTypeBadge(evaluation.tipo)}
                          {getStatusBadge(evaluation.estado)}
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {evaluation.paciente.edad} años • {formatDate(evaluation.fecha)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Áreas Evaluadas</h4>
                        <div className="flex flex-wrap gap-2">
                          {evaluation.areasEvaluadas.map((area, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                        
                        {evaluation.proximaEvaluacion && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">
                              <strong>Próxima evaluación:</strong> {formatDate(evaluation.proximaEvaluacion)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        {evaluation.resultados && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Resultados</h4>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {evaluation.resultados}
                            </p>
                          </div>
                        )}

                        {evaluation.documentos && evaluation.documentos.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Documentos</h4>
                            <div className="space-y-1">
                              {evaluation.documentos.map((doc, idx) => (
                                <div key={idx} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                                  <a href={doc.url} className="truncate">{doc.nombre}</a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {evaluation.recomendaciones && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-2">Recomendaciones</h4>
                        <p className="text-sm text-gray-600">
                          {evaluation.recomendaciones}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                      <Button size="sm" variant="outline">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      {isProfesional && (
                        <>
                          <Button size="sm" variant="outline">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            <PrinterIcon className="h-4 w-4 mr-1" />
                            Imprimir
                          </Button>
                          <Button size="sm" variant="outline">
                            <ShareIcon className="h-4 w-4 mr-1" />
                            Compartir
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No se encontraron evaluaciones</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no hay evaluaciones registradas'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
