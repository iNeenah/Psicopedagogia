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
export const showSuccess = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    iconTheme: {
      primary: '#10B981',
      secondary: '#fff',
    },
  })
}

// Toast de error
export const showError = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  })
}

// Toast de advertencia
export const showWarning = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: '⚠️',
  })
}

// Toast de información
export const showInfo = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: 'ℹ️',
  })
}

// Toast de carga
export const showLoading = (message: string = 'Cargando...') => {
  return toast.loading(message, toastConfig)
}

// Cerrar toast específico
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

// Cerrar todos los toasts
export const dismissAllToasts = () => {
  toast.dismiss()
}

// Promise toast - muestra loading y cambia automáticamente
export const promiseToast = async <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) => {
  return toast.promise(promise, messages, toastConfig)
}
