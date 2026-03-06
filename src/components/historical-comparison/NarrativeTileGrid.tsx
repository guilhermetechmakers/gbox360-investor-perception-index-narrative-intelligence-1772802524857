import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TimeDecayedCount } from '@/lib/historical-comparison/narrativePersistenceEngine'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface NarrativeTileGridProps {
  timeDecayedCounts: TimeDecayedCount[]
  isLoading?: boolean
  className?: string
}

function getIntensityClass(contribution: number, maxContribution: number): string {
  if (maxContribution <= 0) return 'bg-cardPastel-sage/20'
  const ratio = contribution / maxContribution
  if (ratio >= 0.8) return 'bg-cardPastel-sage'
  if (ratio >= 0.5) return 'bg-cardPastel-sage/70'
  if (ratio >= 0.3) return 'bg-cardPastel-sage/50'
  return 'bg-cardPastel-sage/30'
}

export function NarrativeTileGrid({
  timeDecayedCounts,
  isLoading = false,
  className,
}: NarrativeTileGridProps) {
  const items = Array.isArray(timeDecayedCounts) ? timeDecayedCounts : []
  const maxDecay = items.length > 0
    ? Math.max(...items.map((i) => i.decayedContribution))
    : 1

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel bg-cardPastel-sand', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Narrative persistence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-muted/50"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn('rounded-card card-pastel bg-cardPastel-sand', className)}
      aria-labelledby="narrative-tile-grid-title"
    >
      <CardHeader>
        <CardTitle id="narrative-tile-grid-title" className="font-serif text-lg">
          Narrative persistence
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Time-decayed narrative density (darker = higher contribution)
        </p>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No narrative data in this window.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {items.map((item) => (
              <div
                key={item.date}
                className={cn(
                  'flex flex-col items-center rounded-lg border border-border/30 p-2 transition-all duration-200 hover:border-border',
                  getIntensityClass(item.decayedContribution, maxDecay)
                )}
                title={`${item.date}: ${item.count} events, decayed: ${item.decayedContribution.toFixed(2)}`}
              >
                <span className="text-xs font-medium text-foreground">
                  {format(new Date(item.date), 'MMM d')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
