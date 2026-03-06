import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { getPasswordStrength } from '@/utils/validation'

export interface PasswordStrengthMeterProps {
  password: string
  className?: string
  showLabel?: boolean
}

const strengthBarColors: Record<string, string> = {
  Weak: '[&>div]:bg-destructive',
  Fair: '[&>div]:bg-amber-500',
  Good: '[&>div]:bg-emerald-500',
  Strong: '[&>div]:bg-emerald-600',
}

const strengthTextColors: Record<string, string> = {
  Weak: 'text-destructive',
  Fair: 'text-amber-600',
  Good: 'text-emerald-600',
  Strong: 'text-emerald-700',
}

export function PasswordStrengthMeter({
  password,
  className,
  showLabel = true,
}: PasswordStrengthMeterProps) {
  const { score, label } = getPasswordStrength(password ?? '')
  const value = Math.min(100, score * 25)

  if (!password || password.length === 0) {
    return null
  }

  return (
    <div
      className={cn('space-y-1.5', className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2">
        <Progress
          value={value}
          className={cn(
            'h-2 flex-1 [&>div]:transition-all duration-300',
            strengthBarColors[label] ?? '[&>div]:bg-primary'
          )}
        />
        {showLabel && (
          <span
            className={cn(
              'min-w-[4rem] text-xs font-medium',
              strengthTextColors[label] ?? 'text-muted-foreground'
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
