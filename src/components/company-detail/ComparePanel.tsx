import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WindowStats {
  currentIpi?: number
  delta?: number
  breakdown?: { narrative: number; credibility: number; risk: number }
}

export interface ComparePanelProps {
  currentWindowStats: WindowStats
  previousWindowStats?: WindowStats
  baselineStats?: WindowStats
  className?: string
}

function StatRow({
  label,
  value,
  delta,
}: {
  label: string
  value: number
  delta?: number
}) {
  const hasDelta = typeof delta === 'number'
  const isPositive = (delta ?? 0) >= 0

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-serif font-semibold text-foreground">{value}</span>
        {hasDelta && (
          <span
            className={cn(
              'flex items-center text-xs font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? (
              <TrendingUp className="mr-0.5 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-0.5 h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {delta}%
          </span>
        )}
      </div>
    </div>
  )
}

export function ComparePanel({
  currentWindowStats,
  previousWindowStats,
  baselineStats,
  className,
}: ComparePanelProps) {
  const current = currentWindowStats?.currentIpi ?? 0
  const prev = previousWindowStats?.currentIpi
  const baseline = baselineStats?.currentIpi

  const deltaVsPrev =
    typeof prev === 'number' && prev > 0 ? ((current - prev) / prev) * 100 : undefined
  const deltaVsBaseline =
    typeof baseline === 'number' && baseline > 0
      ? ((current - baseline) / baseline) * 100
      : undefined

  const hasComparison = previousWindowStats || baselineStats

  if (!hasComparison) {
    return null
  }

  return (
    <Card
      className={cn('rounded-card card-pastel', className)}
      aria-labelledby="compare-panel-title"
    >
      <CardHeader>
        <CardTitle id="compare-panel-title" className="font-serif text-lg">
          Comparison
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          IPI vs prior window and baseline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatRow
          label="Current window"
          value={current}
        />
        {previousWindowStats && (
          <StatRow
            label="vs prior window"
            value={current}
            delta={deltaVsPrev}
          />
        )}
        {baselineStats && (
          <StatRow
            label="vs baseline"
            value={current}
            delta={deltaVsBaseline}
          />
        )}
      </CardContent>
    </Card>
  )
}
