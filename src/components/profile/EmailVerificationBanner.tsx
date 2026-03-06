import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmailVerificationBannerProps {
  onResendVerification: () => void
  isResending?: boolean
  className?: string
}

export function EmailVerificationBanner({
  onResendVerification,
  isResending = false,
  className,
}: EmailVerificationBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col gap-3 rounded-card border border-amber-500/40 bg-cardPastel-cream/80 p-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-medium text-foreground">
            Verify your email address
          </p>
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the verification link to complete
            your account setup. This ensures audit trails and notifications work
            correctly.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onResendVerification}
        disabled={isResending}
        className="shrink-0 rounded-full border-amber-500/50 hover:bg-amber-500/10"
      >
        {isResending ? 'Sending…' : 'Resend verification'}
      </Button>
    </div>
  )
}
