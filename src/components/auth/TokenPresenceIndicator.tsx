import { cn } from '@/lib/utils'
import { KeyRound, AlertCircle } from 'lucide-react'

export interface TokenPresenceIndicatorProps {
  hasToken: boolean
  isRecoveryFlow?: boolean
  className?: string
}

export function TokenPresenceIndicator({
  hasToken,
  isRecoveryFlow = false,
  className,
}: TokenPresenceIndicatorProps) {
  if (hasToken || isRecoveryFlow) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <KeyRound className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          {isRecoveryFlow
            ? 'Reset link detected. Enter your new password below.'
            : 'Reset token present. You can set your new password.'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
      <span>No reset token found. Use the link from your email to reset your password.</span>
    </div>
  )
}
