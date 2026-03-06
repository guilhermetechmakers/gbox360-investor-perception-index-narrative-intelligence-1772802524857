import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { NarrativeEvent } from '@/types/narrative'

export interface NarrativeEventCardProps {
  narrative: { id: string; summary?: string }
  events: NarrativeEvent[]
  companyId: string
  onOpenRawPayload?: (eventId: string) => void
  className?: string
}

export function NarrativeEventCard({
  narrative,
  events,
  companyId,
  onOpenRawPayload,
  className,
}: NarrativeEventCardProps) {
  const safeEvents = Array.isArray(events) ? events : []

  return (
    <Card
      className={cn(
        'rounded-xl border border-border bg-cardPastel-cream/50 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5',
        className
      )}
    >
      <CardContent className="p-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Contributing events ({safeEvents.length})
        </p>
        <ul className="space-y-3" role="list">
          {safeEvents.map((event) => (
            <li
              key={event.eventId ?? Math.random()}
              className="flex items-start justify-between gap-2 rounded-lg border border-border bg-white/60 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {event.speakerEntity ?? event.source} · {event.speakerRole ?? event.platform ?? '—'}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {event.rawText ?? '—'}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {event.publishedAt ?? event.ingestedAt ?? '—'} ·{' '}
                  {(event.canonicalTopics ?? []).join(', ') || '—'}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {onOpenRawPayload ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenRawPayload(event.eventId ?? '')}
                    aria-label={`View raw payload for ${event.source}`}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                ) : (
                  <Link
                    to={`/dashboard/raw-payload/${event.eventId ?? ''}`}
                    aria-label={`View raw payload for ${event.source}`}
                  >
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link
                  to={`/dashboard/companies/${companyId}/narratives/${narrative.id}`}
                  aria-label="View narrative details"
                >
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
