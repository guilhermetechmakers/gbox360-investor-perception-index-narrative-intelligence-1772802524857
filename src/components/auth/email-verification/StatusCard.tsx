import { cn } from '@/lib/utils'
import { Mail, CheckCircle, XCircle, Clock } from 'lucide-react'

export type StatusCardVariant = 'pending' | 'success' | 'expired' | 'invalid'

export interface StatusCardProps {
  variant: StatusCardVariant
  title: string
  message: string
  className?: string
}

const variantConfig: Record<
  StatusCardVariant,
  { icon: typeof Mail; iconBg: string; iconColor: string; cardBg: string }
> = {
  pending: {
    icon: Clock,
    iconBg: 'bg-cardPastel-cream/50',
    iconColor: 'text-primary',
    cardBg: 'bg-cardPastel-cream/30 border-cardPastel-cream',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-cardPastel-sage/50',
    iconColor: 'text-green-700',
    cardBg: 'bg-cardPastel-sage/30 border-cardPastel-sage',
  },
  expired: {
    icon: XCircle,
    iconBg: 'bg-cardPastel-blush/50',
    iconColor: 'text-destructive',
    cardBg: 'bg-cardPastel-blush/30 border-cardPastel-blush',
  },
  invalid: {
    icon: XCircle,
    iconBg: 'bg-cardPastel-blush/50',
    iconColor: 'text-destructive',
    cardBg: 'bg-cardPastel-blush/30 border-cardPastel-blush',
  },
}

export function StatusCard({ variant, title, message, className }: StatusCardProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'rounded-[20px] border p-6 shadow-card transition-all duration-200 sm:rounded-[28px] sm:p-8',
        config.cardBg,
        className
      )}
    >
      <div
        className={cn(
          'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16',
          config.iconBg
        )}
      >
        <Icon className={cn('h-8 w-8 sm:h-9 sm:w-9', config.iconColor)} aria-hidden />
      </div>
      <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">{message}</p>
    </div>
  )
}
