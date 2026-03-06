import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HistoricalComparisonEmptyStateProps {
  reason?: string
  guidance?: string
  className?: string
}

export function HistoricalComparisonEmptyState({
  reason = 'No comparison data',
  guidance = 'Select a company from the dashboard, then choose a baseline window and optional peer to compare IPI and narrative persistence.',
  className,
}: HistoricalComparisonEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 rounded-card border border-border bg-muted/20 py-16 px-6 text-center',
        className
      )}
      role="status"
      aria-label="Empty state"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-cardPastel-cream"
        aria-hidden
      >
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {reason}
        </h3>
        <p className="text-sm text-muted-foreground">{guidance}</p>
      </div>
    </div>
  )
}
