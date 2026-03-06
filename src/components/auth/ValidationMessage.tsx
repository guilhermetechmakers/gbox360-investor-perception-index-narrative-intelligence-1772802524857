import { cn } from '@/lib/utils'

export interface ValidationMessageProps {
  message?: string | null
  className?: string
}

export function ValidationMessage({ message, className }: ValidationMessageProps) {
  if (!message?.trim()) return null
  return (
    <p
      role="alert"
      className={cn('text-sm text-destructive', className)}
    >
      {message}
    </p>
  )
}
