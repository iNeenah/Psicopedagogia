'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useSettingsStore()

  useEffect(() => {
    // Initialize theme on mount
    const applyTheme = (themeToApply: string) => {
      if (themeToApply === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (themeToApply === 'light') {
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
    }

    // Apply current theme
    applyTheme(theme)

    // Listen for system theme changes if theme is set to 'system'
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

    if (theme === 'system') {
      mediaQuery.addEventListener('change', handleChange)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return <>{children}</>
}
