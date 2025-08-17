'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Con SSR, no queremos re-fetching inmediatamente del cliente
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: (failureCount, error: any) => {
              // No reintentar en errores 4xx
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              // Máximo 3 reintentos para otros errores
              return failureCount < 3
            },
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Solo mostrar devtools en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
