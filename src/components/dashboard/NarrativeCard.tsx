import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NarrativeContribution } from '@/types/dashboard'

export interface NarrativeCardProps {
  narrative: NarrativeContribution
  companyId: string
  className?: string
}

export function NarrativeCard({
  narrative,
  companyId,
  className,
}: NarrativeCardProps) {
  const sources = narrative?.sources ?? []
  const contribution = narrative?.contribution ?? 0
  const title = narrative?.title ?? '—'

  return (
    <Card
      className={cn(
        'rounded-card card-pastel overflow-hidden transition-all duration-200 hover:shadow-card-hover',
        'bg-cardPastel-cream border-border',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-foreground line-clamp-2">
              {title}
            </p>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {contribution}%
            </span>
          </div>
          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sources.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-md border border-border bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          <Link
            to={`/dashboard/companies/${companyId}/narratives/${narrative.narrativeId}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-label={`Why did this move? View narrative: ${title}`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary hover:bg-transparent hover:text-primary/80"
            >
              Why did this move?
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
