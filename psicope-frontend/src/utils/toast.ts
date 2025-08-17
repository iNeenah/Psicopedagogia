import toast from 'react-hot-toast'

// Configuración de estilos para los toasts
const toastConfig = {
  duration: 4000,
  style: {
    borderRadius: '8px',
    background: '#333',
    color: '#fff',
    fontSize: '14px',
  },
}

// Toast de éxito
const success = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    iconTheme: {
      primary: '#10B981',
      secondary: '#fff',
    },
  })
}

// Toast de error
const error = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  })
}

// Toast de advertencia
const warning = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: '⚠️',
  })
}

// Toast de información
const info = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: 'ℹ️',
  })
}

// Toast de carga
const loading = (message: string = 'Cargando...') => {
  return toast.loading(message, toastConfig)
}

// Cerrar toast específico
const dismiss = (toastId: string) => {
  toast.dismiss(toastId)
}

// Cerrar todos los toasts
const dismissAll = () => {
  toast.dismiss()
}

// Promise toast - muestra loading y cambia automáticamente
const promise = async <T>(
  promiseToResolve: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) => {
  return toast.promise(promiseToResolve, messages, toastConfig)
}

export const showToast = {
  success,
  error,
  warning,
  info,
  loading,
  dismiss,
  dismissAll,
  promise,
}
