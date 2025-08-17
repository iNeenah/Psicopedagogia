'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts'

// Datos de ejemplo para gráficos
const monthlyData = [
  { mes: 'Ene', sesiones: 45, ingresos: 90000, pacientesNuevos: 8, evaluaciones: 15 },
  { mes: 'Feb', sesiones: 52, ingresos: 104000, pacientesNuevos: 12, evaluaciones: 18 },
  { mes: 'Mar', sesiones: 48, ingresos: 96000, pacientesNuevos: 6, evaluaciones: 16 },
  { mes: 'Abr', sesiones: 58, ingresos: 116000, pacientesNuevos: 14, evaluaciones: 22 },
  { mes: 'May', sesiones: 65, ingresos: 130000, pacientesNuevos: 18, evaluaciones: 25 },
  { mes: 'Jun', sesiones: 72, ingresos: 144000, pacientesNuevos: 16, evaluaciones: 28 }
]

const sessionTypeData = [
  { name: 'Terapia Individual', value: 45, color: '#3B82F6' },
  { name: 'Evaluaciones', value: 25, color: '#10B981' },
  { name: 'Terapia Grupal', value: 15, color: '#F59E0B' },
  { name: 'Consultas', value: 15, color: '#EF4444' }
]

const ageGroupData = [
  { grupo: '0-12 años', pacientes: 18, porcentaje: 30 },
  { grupo: '13-17 años', pacientes: 12, porcentaje: 20 },
  { grupo: '18-35 años', pacientes: 20, porcentaje: 33 },
  { grupo: '36-50 años', pacientes: 8, porcentaje: 13 },
  { grupo: '50+ años', pacientes: 2, porcentaje: 4 }
]

const therapyOutcomes = [
  { categoria: 'Alta Exitosa', value: 85, color: '#10B981' },
  { categoria: 'En Progreso', value: 70, color: '#3B82F6' },
  { categoria: 'Abandonos', value: 15, color: '#EF4444' }
]

const weeklySchedule = [
  { dia: 'Lun', sesiones: 12, horasLibres: 4 },
  { dia: 'Mar', sesiones: 10, horasLibres: 6 },
  { dia: 'Mié', sesiones: 14, horasLibres: 2 },
  { dia: 'Jue', sesiones: 11, horasLibres: 5 },
  { dia: 'Vie', sesiones: 13, horasLibres: 3 },
  { dia: 'Sáb', sesiones: 8, horasLibres: 0 }
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function StatisticsPage() {
  const { isProfesional } = useRequireAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  if (!isProfesional) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </DashboardLayout>
    )
  }

  const totalIngresos = monthlyData.reduce((acc, curr) => acc + curr.ingresos, 0)
  const totalSesiones = monthlyData.reduce((acc, curr) => acc + curr.sesiones, 0)
  const totalPacientesNuevos = monthlyData.reduce((acc, curr) => acc + curr.pacientesNuevos, 0)
  const totalEvaluaciones = monthlyData.reduce((acc, curr) => acc + curr.evaluaciones, 0)

  const promedioIngresosSesion = totalIngresos / totalSesiones
  const crecimientoMensual = ((monthlyData[monthlyData.length - 1].ingresos - monthlyData[0].ingresos) / monthlyData[0].ingresos) * 100

  const kpis = [
    {
      titulo: 'Ingresos Totales',
      valor: `$${totalIngresos.toLocaleString()}`,
      cambio: `+${crecimientoMensual.toFixed(1)}%`,
      tendencia: 'up' as const,
      icono: CurrencyDollarIcon,
      color: 'text-green-600'
    },
    {
      titulo: 'Total Sesiones',
      valor: totalSesiones.toString(),
      cambio: '+12%',
      tendencia: 'up' as const,
      icono: CalendarDaysIcon,
      color: 'text-blue-600'
    },
    {
      titulo: 'Pacientes Nuevos',
      valor: totalPacientesNuevos.toString(),
      cambio: '+8%',
      tendencia: 'up' as const,
      icono: UserGroupIcon,
      color: 'text-purple-600'
    },
    {
      titulo: 'Promedio por Sesión',
      valor: `$${promedioIngresosSesion.toFixed(0)}`,
      cambio: '+5%',
      tendencia: 'up' as const,
      icono: ChartBarIcon,
      color: 'text-orange-600'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
            <p className="text-gray-600">
              Analiza el rendimiento y métricas de tu práctica
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border border-gray-300">
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 
                   period === 'quarter' ? 'Trimestre' : 'Año'}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.titulo}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.valor}</p>
                      <div className="flex items-center mt-2">
                        {kpi.tendencia === 'up' ? (
                          <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          kpi.tendencia === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpi.cambio}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-50`}>
                      <kpi.icono className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos y Sesiones */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ingresos y Sesiones Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: any, name: any) => [
                        name === 'ingresos' ? `$${value.toLocaleString()}` : value,
                        name === 'ingresos' ? 'Ingresos' : 'Sesiones'
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sesiones" fill="#3B82F6" name="Sesiones" />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      name="Ingresos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tipos de Sesión */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Tipos de Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sessionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sessionTypeData.map((entry, index) => (
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

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grupos de Edad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Pacientes por Edad</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ageGroupData} layout="verseX" margin={{ left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="grupo" type="category" width={60} />
                    <Tooltip formatter={(value: any) => [value, 'Pacientes']} />
                    <Bar dataKey="pacientes" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Horarios Semanales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ocupación Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklySchedule}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sesiones" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      name="Sesiones Ocupadas" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="horasLibres" 
                      stackId="1" 
                      stroke="#E5E7EB" 
                      fill="#E5E7EB"
                      name="Horas Libres" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resultados de Terapia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Resultados Terapéuticos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={therapyOutcomes}>
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff' }}
                      dataKey="value"
                    />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Stats Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Resumen Mensual Detallado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sesiones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pac. Nuevos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promedio/Sesión
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyData.map((data, index) => (
                      <tr key={data.mes} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.mes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.sesiones}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${data.ingresos.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.pacientesNuevos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.evaluaciones}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(data.ingresos / data.sesiones).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
