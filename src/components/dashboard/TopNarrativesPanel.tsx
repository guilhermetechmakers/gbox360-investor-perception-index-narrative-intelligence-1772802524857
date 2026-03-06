import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { NarrativeCard } from './NarrativeCard'
import { cn } from '@/lib/utils'
import type { NarrativeContribution } from '@/types/dashboard'

export interface TopNarrativesPanelProps {
  narratives: NarrativeContribution[]
  companyId: string
  isLoading?: boolean
  className?: string
}

export function TopNarrativesPanel({
  narratives,
  companyId,
  isLoading = false,
  className,
}: TopNarrativesPanelProps) {
  const safeNarratives = Array.isArray(narratives) ? narratives.slice(0, 3) : []

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Top 3 narratives</CardTitle>
          <CardDescription>Driving perception in the selected window</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'rounded-card card-pastel bg-cardPastel-sage',
        className
      )}
      aria-labelledby="top-narratives-title"
      aria-describedby="top-narratives-desc"
    >
      <CardHeader>
        <CardTitle id="top-narratives-title" className="font-serif text-lg">
          Top 3 narratives
        </CardTitle>
        <CardDescription id="top-narratives-desc">
          Driving perception in the selected window
        </CardDescription>
      </CardHeader>
      <CardContent>
        {safeNarratives.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No narratives in this time window. Try a different date range.
          </p>
        ) : (
          <ul className="space-y-3" role="list">
            {safeNarratives.map((n) => (
              <li key={n.narrativeId}>
                <NarrativeCard
                  narrative={n}
                  companyId={companyId}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
