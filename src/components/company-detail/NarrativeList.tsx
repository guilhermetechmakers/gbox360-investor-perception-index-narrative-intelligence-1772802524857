import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronRight, FileText, MessageSquare } from 'lucide-react'
import { NarrativeEventCard } from './NarrativeEventCard'
import { cn } from '@/lib/utils'
import type { Narrative, NarrativeEvent } from '@/types/narrative'

export interface NarrativeListProps {
  narratives: Narrative[]
  companyId: string
  onExpand?: (narrativeId: string) => void
  onOpenRawPayload?: (eventId: string) => void
  isLoading?: boolean
  className?: string
}

export function NarrativeList({
  narratives,
  companyId,
  onOpenRawPayload,
  isLoading = false,
  className,
}: NarrativeListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const safeNarratives = Array.isArray(narratives) ? narratives : []

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) {
    return (
      <Card className={cn('rounded-card', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Narratives</CardTitle>
          <CardDescription>Expand to see contributing events and raw payload links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" role="status" aria-label="Loading narratives">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (safeNarratives.length === 0) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Narratives</CardTitle>
          <CardDescription>Expand to see contributing events and raw payload links</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/20 py-12 px-4 text-center"
            role="status"
            aria-label="No narratives in this time window"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <MessageSquare className="h-7 w-7" />
            </div>
            <div className="max-w-sm space-y-1">
              <p className="font-medium text-foreground">No narratives yet</p>
              <p className="text-sm text-muted-foreground">
                No narrative events match the selected company and time window. Try a different date
                range or check back after more data is ingested.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn('rounded-card card-pastel', className)}
      aria-labelledby="narratives-card-title"
      aria-describedby="narratives-card-desc"
    >
      <CardHeader>
        <CardTitle id="narratives-card-title" className="font-serif text-lg">
          Narratives
        </CardTitle>
        <CardDescription id="narratives-card-desc" className="text-muted-foreground">
          Expand to see contributing events and raw payload links
        </CardDescription>
      </CardHeader>
      <CardContent aria-live="polite">
        <ul className="space-y-2" role="list">
          {safeNarratives.map((narrative) => {
            const isExpanded = expandedIds.has(narrative.id)
            const events = (narrative.events ?? []) as NarrativeEvent[]
            const contributionPercent = narrative.contributionPercent ?? 0

            return (
              <li key={narrative.id}>
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleExpand(narrative.id)}
                >
                  <div
                    className={cn(
                      'rounded-xl border border-border transition-all duration-200',
                      isExpanded
                        ? 'bg-cardPastel-sage/30 shadow-sm'
                        : 'bg-white/80 hover:bg-cardPastel-cream/30 hover:shadow-card'
                    )}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 p-4 text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-expanded={isExpanded}
                        aria-label={`${narrative.summary ?? narrative.id}. ${contributionPercent}% contribution. ${isExpanded ? 'Collapse' : 'Expand'} to see events`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground">
                              {narrative.summary ?? narrative.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {contributionPercent}% contribution · {narrative.topic ?? '—'}
                            </p>
                          </div>
                        </div>
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-border px-4 pb-4 pt-2">
                        <NarrativeEventCard
                          narrative={{
                            id: narrative.id,
                            summary: narrative.summary,
                          }}
                          events={events}
                          companyId={companyId}
                          onOpenRawPayload={onOpenRawPayload}
                        />
                        <div className="mt-3 flex justify-end">
                          <Link
                            to={`/dashboard/companies/${companyId}/narratives/${narrative.id}`}
                          >
                            <Button variant="outline" size="sm">
                              Full narrative drill-down
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
