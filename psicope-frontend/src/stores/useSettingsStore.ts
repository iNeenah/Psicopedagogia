import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type Language = 'es' | 'en'
export type NotificationPreferences = {
  email: boolean
  push: boolean
  sms: boolean
  appointments: boolean
  reminders: boolean
  payments: boolean
  system: boolean
}

export interface SettingsState {
  // Theme settings
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Language settings
  language: Language
  setLanguage: (language: Language) => void
  
  // Notification preferences
  notifications: NotificationPreferences
  setNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void
  setAllNotifications: (preferences: Partial<NotificationPreferences>) => void
  
  // UI preferences
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Professional preferences
  workingHours: {
    start: string
    end: string
    days: number[] // 0-6 (Sunday-Saturday)
  }
  setWorkingHours: (hours: Partial<SettingsState['workingHours']>) => void
  
  // Calendar preferences
  calendarView: 'month' | 'week' | 'day'
  setCalendarView: (view: 'month' | 'week' | 'day') => void
  
  // Dashboard preferences
  defaultDashboard: 'overview' | 'appointments' | 'patients' | 'statistics'
  setDefaultDashboard: (dashboard: SettingsState['defaultDashboard']) => void
  
  // Data preferences
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'
  timeFormat: '12h' | '24h'
  currency: 'MXN' | 'USD'
  setDateFormat: (format: SettingsState['dateFormat']) => void
  setTimeFormat: (format: SettingsState['timeFormat']) => void
  setCurrency: (currency: SettingsState['currency']) => void
  
  // Privacy settings
  privacySettings: {
    shareDataForAnalytics: boolean
    allowMarketingEmails: boolean
    showOnlineStatus: boolean
    allowProfileIndexing: boolean
  }
  setPrivacySetting: (key: keyof SettingsState['privacySettings'], value: boolean) => void
  
  // Reset functions
  resetToDefaults: () => void
  resetNotifications: () => void
}

const defaultSettings: Omit<SettingsState, 'setTheme' | 'setLanguage' | 'setNotificationPreference' | 'setAllNotifications' | 'setSidebarCollapsed' | 'setWorkingHours' | 'setCalendarView' | 'setDefaultDashboard' | 'setDateFormat' | 'setTimeFormat' | 'setCurrency' | 'setPrivacySetting' | 'resetToDefaults' | 'resetNotifications'> = {
  theme: 'system',
  language: 'es',
  notifications: {
    email: true,
    push: true,
    sms: false,
    appointments: true,
    reminders: true,
    payments: true,
    system: false
  },
  sidebarCollapsed: false,
  workingHours: {
    start: '09:00',
    end: '18:00',
    days: [1, 2, 3, 4, 5] // Monday to Friday
  },
  calendarView: 'week',
  defaultDashboard: 'overview',
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '24h',
  currency: 'MXN',
  privacySettings: {
    shareDataForAnalytics: false,
    allowMarketingEmails: false,
    showOnlineStatus: true,
    allowProfileIndexing: false
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      setTheme: (theme) => {
        set({ theme })
        
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // System theme
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (systemTheme) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
      
      setLanguage: (language) => set({ language }),
      
      setNotificationPreference: (key, value) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: value
          }
        })),
      
      setAllNotifications: (preferences) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...preferences
          }
        })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setWorkingHours: (hours) =>
        set((state) => ({
          workingHours: {
            ...state.workingHours,
            ...hours
          }
        })),
      
      setCalendarView: (view) => set({ calendarView: view }),
      
      setDefaultDashboard: (dashboard) => set({ defaultDashboard: dashboard }),
      
      setDateFormat: (format) => set({ dateFormat: format }),
      
      setTimeFormat: (format) => set({ timeFormat: format }),
      
      setCurrency: (currency) => set({ currency: currency }),
      
      setPrivacySetting: (key, value) =>
        set((state) => ({
          privacySettings: {
            ...state.privacySettings,
            [key]: value
          }
        })),
      
      resetToDefaults: () => set(defaultSettings),
      
      resetNotifications: () =>
        set({
          notifications: defaultSettings.notifications
        })
    }),
    {
      name: 'psicope-settings',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
        sidebarCollapsed: state.sidebarCollapsed,
        workingHours: state.workingHours,
        calendarView: state.calendarView,
        defaultDashboard: state.defaultDashboard,
        dateFormat: state.dateFormat,
        timeFormat: state.timeFormat,
        currency: state.currency,
        privacySettings: state.privacySettings
      })
    }
  )
)

// Hook to initialize theme on app start
export const useInitializeTheme = () => {
  const { theme, setTheme } = useSettingsStore()
  
  // Initialize theme on mount
  if (typeof window !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemTheme) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          if (e.matches) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }
}
