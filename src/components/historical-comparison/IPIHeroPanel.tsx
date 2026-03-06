import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TopicTag } from './TopicTag'
import type { IPIComponents, NarrativeEvent } from '@/types/historical-comparison'
import { cn } from '@/lib/utils'

export interface TopNarrativeItem {
  event: NarrativeEvent
  impact?: number
}

export interface IPIHeroPanelProps {
  label: string
  ipi: IPIComponents | null | undefined
  delta?: number | null
  topNarratives?: NarrativeEvent[] | TopNarrativeItem[]
  isLoading?: boolean
  tileVariant?: 'cream' | 'sage'
  className?: string
}

export function IPIHeroPanel({
  label,
  ipi,
  delta = 0,
  topNarratives = [],
  isLoading = false,
  tileVariant = 'cream',
  className,
}: IPIHeroPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const components = ipi ?? ({} as IPIComponents)
  const total = components.total ?? 0
  const deltaVal = delta ?? 0
  const isUp = deltaVal > 0
  const isDown = deltaVal < 0
  const raw = Array.isArray(topNarratives) ? topNarratives : []
  const safeNarratives = raw.slice(0, 3).map((n) => ('event' in n ? n.event : n))

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const tileBg = tileVariant === 'sage' ? 'bg-cardPastel-sage' : 'bg-cardPastel-cream'
  return (
    <Card
      className={cn(
        'rounded-card card-pastel transition-all duration-200 hover:shadow-card-hover',
        tileBg,
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-xs text-muted-foreground">IPI Score</p>
            <p className="font-serif text-4xl font-bold text-foreground">
              {total.toFixed(1)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {isUp && <TrendingUp className="h-5 w-5 text-green-600" aria-hidden />}
            {isDown && <TrendingDown className="h-5 w-5 text-red-600" aria-hidden />}
            {!isUp && !isDown && <Minus className="h-5 w-5 text-muted-foreground" aria-hidden />}
            <span
              className={cn(
                'text-sm font-medium',
                isUp && 'text-green-600',
                isDown && 'text-red-600',
                !isUp && !isDown && 'text-muted-foreground'
              )}
            >
              {isUp ? '+' : ''}
              {deltaVal}%
            </span>
            <span className="text-xs text-muted-foreground">vs prior</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-cardPastel-cream/50 p-2">
            <p className="text-muted-foreground">Narrative</p>
            <p className="font-semibold">{(components.narrative ?? 0).toFixed(1)}</p>
          </div>
          <div className="rounded-lg bg-cardPastel-sage/30 p-2">
            <p className="text-muted-foreground">Credibility</p>
            <p className="font-semibold">{(components.credibility ?? 0).toFixed(1)}</p>
          </div>
          <div className="rounded-lg bg-cardPastel-blush/30 p-2">
            <p className="text-muted-foreground">Risk</p>
            <p className="font-semibold">{(components.risk ?? 0).toFixed(1)}</p>
          </div>
        </div>

        {safeNarratives.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/30"
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse narratives' : 'Expand narratives'}
            >
              Why did this move?
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expanded && (
              <ul className="mt-2 space-y-2 pl-2">
                {safeNarratives.map((n) => (
                  <li key={n.id} className="text-xs">
                    <span className="font-medium">{n.sourcePlatform}</span>
                    <span className="text-muted-foreground">
                      {' '}
                      — {(n.rawText ?? '').slice(0, 60)}…
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(n.topics ?? []).map((t) => (
                        <TopicTag key={t} topic={t} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
