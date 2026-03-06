import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Newspaper, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { NarrativeEventSummary } from '@/types/dashboard'

export interface RecentActivityFeedProps {
  events: NarrativeEventSummary[]
  isLoading?: boolean
  className?: string
}

function getSourceIcon(source: string) {
  const key = (source ?? '').toLowerCase()
  if (key.includes('news') || key.includes('article')) return Newspaper
  if (key.includes('social') || key.includes('twitter') || key.includes('x')) return MessageSquare
  return FileText
}

export function RecentActivityFeed({
  events,
  isLoading = false,
  className,
}: RecentActivityFeedProps) {
  const safeEvents = Array.isArray(events) ? events : []

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Recent activity</CardTitle>
          <CardDescription>Latest narrative events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'rounded-card card-pastel bg-cardPastel-wheat',
        className
      )}
      aria-labelledby="recent-activity-title"
      aria-describedby="recent-activity-desc"
    >
      <CardHeader>
        <CardTitle id="recent-activity-title" className="font-serif text-lg">
          Recent activity
        </CardTitle>
        <CardDescription id="recent-activity-desc">
          Latest narrative events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {safeEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent events. Data will appear as ingestion completes.
          </p>
        ) : (
          <ul className="space-y-2" role="list">
            {safeEvents.slice(0, 8).map((event) => {
              const Icon = getSourceIcon(event.source ?? '')
              const text = event.text ?? event.rawText ?? '—'
              const truncated = text.length > 80 ? `${text.slice(0, 80)}…` : text
              const timestamp = event.timestamp
                ? format(new Date(event.timestamp), 'MMM d, HH:mm')
                : '—'

              return (
                <li key={event.id}>
                  <Link
                    to={`/dashboard/raw-payload/${event.id}`}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`View raw payload: ${event.source} from ${timestamp}`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/60">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground line-clamp-2">
                        {truncated}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.source}
                        {event.speakerRole && ` · ${event.speakerRole}`} · {timestamp}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
