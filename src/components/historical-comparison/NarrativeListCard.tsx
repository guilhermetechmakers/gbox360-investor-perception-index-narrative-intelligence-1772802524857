import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TopicTag } from './TopicTag'
import type { NarrativeEvent } from '@/types/historical-comparison'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface NarrativeListCardProps {
  narrative?: NarrativeEvent
  event?: NarrativeEvent
  impact?: number
  className?: string
}

export function NarrativeListCard({ narrative, event, impact, className }: NarrativeListCardProps) {
  const [expanded, setExpanded] = useState(false)
  const n = narrative ?? event
  if (!n) return null
  const text = n.rawText ?? ''
  const excerpt = text.length > 120 ? text.slice(0, 120) + '…' : text
  const fullText = expanded ? text : excerpt
  const hasMore = text.length > 120
  const topics = Array.isArray(n.topics) ? n.topics : []
  const payloadRef = n.payloadReference ?? ''
  const ts = n.timestamps?.eventAt ?? n.timestamps?.createdAt

  return (
    <Card
      className={cn(
        'rounded-card border border-border/50 bg-card transition-all duration-200 hover:shadow-card-hover',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-serif text-base">
            {n.sourcePlatform}
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {impact != null && (
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                Impact: {impact}%
              </span>
            )}
            {ts && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(ts), 'MMM d, yyyy')}
            </span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {n.speaker?.name ?? 'Unknown'}
          {n.speaker?.role && ` · ${n.speaker.role}`}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground">{fullText}</p>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-primary hover:underline"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 inline h-3 w-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 inline h-3 w-3" />
                Show more
              </>
            )}
          </button>
        )}
        <div className="flex flex-wrap gap-1">
          {topics.map((t) => (
            <TopicTag key={t} topic={t} />
          ))}
        </div>
        {payloadRef && (
          <Link
            to={
              payloadRef.startsWith('/dashboard/')
                ? payloadRef
                : `/dashboard/raw-payload/${payloadRef.replace(/^\/raw-payload\//, '')}`
            }
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Raw Payload
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
