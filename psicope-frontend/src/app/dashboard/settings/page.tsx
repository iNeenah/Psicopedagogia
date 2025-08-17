'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cog6ToothIcon,
  BellIcon,
  UserIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  ClockIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRequireAuth } from '@/hooks/useAuth'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { showToast } from '@/utils/toast'

const SettingSection = ({ title, icon: Icon, children }: {
  title: string
  icon: any
  children: React.ReactNode
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
)

const ToggleSwitch = ({ 
  enabled, 
  onChange, 
  label, 
  description 
}: {
  enabled: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options,
  description 
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  description?: string
}) => (
  <div>
    <label className="text-sm font-medium text-gray-900 block mb-1">
      {label}
    </label>
    {description && (
      <p className="text-xs text-gray-500 mb-2">{description}</p>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

const TimeInput = ({ 
  label, 
  value, 
  onChange 
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <div>
    <label className="text-sm font-medium text-gray-900 block mb-1">
      {label}
    </label>
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
)

export default function SettingsPage() {
  const { user } = useRequireAuth()
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    notifications,
    setNotificationPreference,
    workingHours,
    setWorkingHours,
    calendarView,
    setCalendarView,
    defaultDashboard,
    setDefaultDashboard,
    dateFormat,
    timeFormat,
    currency,
    setDateFormat,
    setTimeFormat,
    setCurrency,
    privacySettings,
    setPrivacySetting,
    resetToDefaults,
    resetNotifications
  } = useSettingsStore()

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'professional'>('general')

  const handleSave = () => {
    showToast.success('Configuración guardada exitosamente')
  }

  const handleResetAll = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todas las configuraciones?')) {
      resetToDefaults()
      showToast.success('Configuración restablecida a valores predeterminados')
    }
  }

  const tabs = [
    { key: 'general', label: 'General', icon: Cog6ToothIcon },
    { key: 'notifications', label: 'Notificaciones', icon: BellIcon },
    { key: 'privacy', label: 'Privacidad', icon: ShieldCheckIcon },
    ...(user?.rol === 'profesional' ? [{ key: 'professional', label: 'Profesional', icon: UserIcon }] : [])
  ] as const

  const themeIcons = {
    light: SunIcon,
    dark: MoonIcon,
    system: ComputerDesktopIcon
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600">
              Personaliza tu experiencia en la plataforma
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleResetAll}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
            <Button onClick={handleSave}>
              <CheckIcon className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <SettingSection title="Apariencia" icon={PaintBrushIcon}>
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-3">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'system'] as const).map((themeOption) => {
                        const Icon = themeIcons[themeOption]
                        return (
                          <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              theme === themeOption
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm capitalize">
                              {themeOption === 'system' ? 'Sistema' : themeOption === 'light' ? 'Claro' : 'Oscuro'}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </SettingSection>

                <SettingSection title="Idioma y Región" icon={LanguageIcon}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      label="Idioma"
                      value={language}
                      onChange={(value) => setLanguage(value as any)}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' }
                      ]}
                    />
                    <SelectField
                      label="Formato de fecha"
                      value={dateFormat}
                      onChange={(value) => setDateFormat(value as any)}
                      options={[
                        { value: 'dd/mm/yyyy', label: 'DD/MM/AAAA' },
                        { value: 'mm/dd/yyyy', label: 'MM/DD/AAAA' },
                        { value: 'yyyy-mm-dd', label: 'AAAA-MM-DD' }
                      ]}
                    />
                    <SelectField
                      label="Formato de hora"
                      value={timeFormat}
                      onChange={(value) => setTimeFormat(value as any)}
                      options={[
                        { value: '12h', label: '12 horas (AM/PM)' },
                        { value: '24h', label: '24 horas' }
                      ]}
                    />
                  </div>
                </SettingSection>

                <SettingSection title="Moneda" icon={CurrencyDollarIcon}>
                  <SelectField
                    label="Moneda predeterminada"
                    value={currency}
                    onChange={(value) => setCurrency(value as any)}
                    options={[
                      { value: 'MXN', label: 'Peso Mexicano (MXN)' },
                      { value: 'USD', label: 'Dólar Americano (USD)' }
                    ]}
                    description="Esta moneda se usará en todos los reportes y facturas"
                  />
                </SettingSection>

                <SettingSection title="Dashboard" icon={ComputerDesktopIcon}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Dashboard predeterminado"
                      value={defaultDashboard}
                      onChange={(value) => setDefaultDashboard(value as any)}
                      options={[
                        { value: 'overview', label: 'Vista general' },
                        { value: 'appointments', label: 'Citas' },
                        { value: 'patients', label: 'Pacientes' },
                        { value: 'statistics', label: 'Estadísticas' }
                      ]}
                      description="Página que se mostrará al iniciar sesión"
                    />
                    <SelectField
                      label="Vista de calendario"
                      value={calendarView}
                      onChange={(value) => setCalendarView(value as any)}
                      options={[
                        { value: 'month', label: 'Mensual' },
                        { value: 'week', label: 'Semanal' },
                        { value: 'day', label: 'Diaria' }
                      ]}
                      description="Vista predeterminada del calendario"
                    />
                  </div>
                </SettingSection>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <SettingSection title="Canales de notificación" icon={BellIcon}>
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={notifications.email}
                      onChange={(value) => setNotificationPreference('email', value)}
                      label="Correo electrónico"
                      description="Recibir notificaciones por correo electrónico"
                    />
                    <ToggleSwitch
                      enabled={notifications.push}
                      onChange={(value) => setNotificationPreference('push', value)}
                      label="Notificaciones push"
                      description="Recibir notificaciones en el navegador"
                    />
                    <ToggleSwitch
                      enabled={notifications.sms}
                      onChange={(value) => setNotificationPreference('sms', value)}
                      label="SMS"
                      description="Recibir notificaciones por mensaje de texto"
                    />
                  </div>
                </SettingSection>

                <SettingSection title="Tipos de notificaciones" icon={BellIcon}>
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={notifications.appointments}
                      onChange={(value) => setNotificationPreference('appointments', value)}
                      label="Citas"
                      description="Nuevas citas, cambios y cancelaciones"
                    />
                    <ToggleSwitch
                      enabled={notifications.reminders}
                      onChange={(value) => setNotificationPreference('reminders', value)}
                      label="Recordatorios"
                      description="Recordatorios de próximas sesiones"
                    />
                    <ToggleSwitch
                      enabled={notifications.payments}
                      onChange={(value) => setNotificationPreference('payments', value)}
                      label="Pagos"
                      description="Confirmaciones de pago y facturas"
                    />
                    <ToggleSwitch
                      enabled={notifications.system}
                      onChange={(value) => setNotificationPreference('system', value)}
                      label="Sistema"
                      description="Actualizaciones y mantenimiento del sistema"
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetNotifications()
                        showToast.success('Configuración de notificaciones restablecida')
                      }}
                    >
                      Restablecer notificaciones
                    </Button>
                  </div>
                </SettingSection>
              </motion.div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <SettingSection title="Privacidad de datos" icon={ShieldCheckIcon}>
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={privacySettings.shareDataForAnalytics}
                      onChange={(value) => setPrivacySetting('shareDataForAnalytics', value)}
                      label="Compartir datos para análisis"
                      description="Ayudanos a mejorar la plataforma compartiendo datos anónimos de uso"
                    />
                    <ToggleSwitch
                      enabled={privacySettings.allowMarketingEmails}
                      onChange={(value) => setPrivacySetting('allowMarketingEmails', value)}
                      label="Correos de marketing"
                      description="Recibir correos sobre nuevas funciones y promociones"
                    />
                    <ToggleSwitch
                      enabled={privacySettings.showOnlineStatus}
                      onChange={(value) => setPrivacySetting('showOnlineStatus', value)}
                      label="Mostrar estado en línea"
                      description="Otros usuarios pueden ver cuando estás conectado"
                    />
                    <ToggleSwitch
                      enabled={privacySettings.allowProfileIndexing}
                      onChange={(value) => setPrivacySetting('allowProfileIndexing', value)}
                      label="Indexación de perfil"
                      description="Permitir que tu perfil aparezca en resultados de búsqueda externos"
                    />
                  </div>
                </SettingSection>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">Zona de peligro</h3>
                    <p className="text-red-700 mb-4">
                      Las siguientes acciones son permanentes y no se pueden deshacer.
                    </p>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Descargar mis datos
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Eliminar mi cuenta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Professional Settings */}
            {activeTab === 'professional' && user?.role === 'profesional' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <SettingSection title="Horarios de trabajo" icon={ClockIcon}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TimeInput
                      label="Hora de inicio"
                      value={workingHours.start}
                      onChange={(value) => setWorkingHours({ start: value })}
                    />
                    <TimeInput
                      label="Hora de fin"
                      value={workingHours.end}
                      onChange={(value) => setWorkingHours({ end: value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-3">
                      Días laborales
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { day: 0, label: 'Dom' },
                        { day: 1, label: 'Lun' },
                        { day: 2, label: 'Mar' },
                        { day: 3, label: 'Mié' },
                        { day: 4, label: 'Jue' },
                        { day: 5, label: 'Vie' },
                        { day: 6, label: 'Sáb' }
                      ].map(({ day, label }) => (
                        <button
                          key={day}
                          onClick={() => {
                            const newDays = workingHours.days.includes(day)
                              ? workingHours.days.filter(d => d !== day)
                              : [...workingHours.days, day]
                            setWorkingHours({ days: newDays })
                          }}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            workingHours.days.includes(day)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </SettingSection>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
