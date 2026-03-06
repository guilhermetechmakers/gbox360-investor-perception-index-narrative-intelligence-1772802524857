import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const COLOR_THEMES = {
  cream: 'bg-[#FBD8C5]/40',
  sand: 'bg-[#E8DED3]/50',
  sage: 'bg-[#C8D4C0]/40',
  wheat: 'bg-[#D8C9B0]/50',
  blush: 'bg-[#E6C9C2]/40',
  white: 'bg-white',
} as const

export type MetricsCardColorTheme = keyof typeof COLOR_THEMES

export interface MetricsCardProps {
  title: string
  value: number | string | null | undefined
  delta?: number
  unit?: string
  hint?: string
  colorTheme?: MetricsCardColorTheme
  icon?: LucideIcon
  isLoading?: boolean
}

export function MetricsCard({
  title,
  value,
  delta,
  unit = '',
  hint,
  colorTheme = 'cream',
  icon: Icon,
  isLoading = false,
}: MetricsCardProps) {
  const hasValue = value !== null && value !== undefined && value !== ''
  const displayValue = hasValue ? `${value}${unit}` : '—'

  return (
    <Card
      className={cn(
        'rounded-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        COLOR_THEMES[colorTheme]
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon
            className="h-5 w-5 text-muted-foreground shrink-0"
            aria-hidden
          />
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <p className="text-2xl font-semibold text-foreground">
              {displayValue}
            </p>
            {(delta != null || hint) && (
              <div className="mt-1 flex items-center gap-2">
                {delta != null && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium',
                      delta >= 0 ? 'text-emerald-600' : 'text-destructive'
                    )}
                  >
                    {delta >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {delta >= 0 ? '+' : ''}
                    {delta}%
                  </span>
                )}
                {hint && (
                  <span className="text-xs text-muted-foreground">{hint}</span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
