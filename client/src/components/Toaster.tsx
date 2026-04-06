import { useToast } from '@/hooks/useToast'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'

// Global toast state
let globalToast: ReturnType<typeof useToast>['toast'] | null = null

export function setGlobalToast(fn: typeof globalToast) {
  globalToast = fn
}

export function showToast(opts: { title: string; description?: string; variant?: 'default' | 'destructive' }) {
  globalToast?.(opts)
}

export function Toaster() {
  const { toasts, toast, dismiss } = useToast()

  // Register the global toast function
  setGlobalToast(toast)

  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} onOpenChange={() => dismiss(t.id)}>
          <div className="grid gap-1">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
