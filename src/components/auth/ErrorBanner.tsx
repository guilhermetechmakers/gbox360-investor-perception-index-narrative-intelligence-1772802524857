import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

export interface ErrorBannerProps {
  message?: string
  className?: string
  onDismiss?: () => void
}

export function ErrorBanner({ message, className, onDismiss }: ErrorBannerProps) {
  if (!message?.trim()) return null
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  )
}
