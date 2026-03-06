import { cn } from '@/lib/utils'
import { isValidEmail } from '@/utils/validation'
import { Check, X } from 'lucide-react'

export interface EmailValidationHelperProps {
  email: string
  className?: string
}

export function EmailValidationHelper({ email, className }: EmailValidationHelperProps) {
  if (!email || email.trim().length === 0) {
    return null
  }

  const valid = isValidEmail(email.trim())

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs',
        valid ? 'text-emerald-600' : 'text-destructive',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {valid ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          <span>Valid email format</span>
        </>
      ) : (
        <>
          <X className="h-3.5 w-3.5" aria-hidden />
          <span>Enter a valid email (e.g. you@company.com)</span>
        </>
      )}
    </div>
  )
}
