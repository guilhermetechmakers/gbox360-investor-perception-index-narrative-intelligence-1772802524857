import { Link } from 'react-router-dom'
import { ErrorBanner } from './ErrorBanner'
import { cn } from '@/lib/utils'

export interface ErrorDisplayProps {
  message?: string | null
  supportLink?: boolean
  onDismiss?: () => void
  className?: string
}

export function ErrorDisplay({
  message,
  supportLink = true,
  onDismiss,
  className,
}: ErrorDisplayProps) {
  if (!message?.trim()) return null

  return (
    <div className={cn('space-y-2', className)}>
      <ErrorBanner message={message} onDismiss={onDismiss} />
      {supportLink && (
        <p className="text-xs text-muted-foreground">
          If this persists,{' '}
          <Link to="/about" className="font-medium text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      )}
    </div>
  )
}
