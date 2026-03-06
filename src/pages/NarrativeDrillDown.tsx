import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNarrative } from '@/hooks/use-narratives'
import { useCompany } from '@/hooks/use-companies'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ExportAuditButton } from '@/components/dashboard'
import { FileText, ArrowLeft, Shield, BarChart3 } from 'lucide-react'
import type { NarrativeEvent } from '@/types/narrative'
import { useMemo } from 'react'

export default function NarrativeDrillDown() {
  const { companyId, narrativeId } = useParams<{
    companyId: string
    narrativeId: string
  }>()
  const cid = companyId ?? ''
  const nid = narrativeId ?? ''

  const { data: narrative, isLoading } = useNarrative(cid, nid)
  const { data: company } = useCompany(cid)

  const events = narrative?.events ?? []
  const safeEvents = Array.isArray(events) ? events : []

  const exportDataset = useMemo(() => {
    const items: unknown[] = []
    if (narrative) {
      items.push({ type: 'narrative', ...narrative })
    }
    for (const e of safeEvents) {
      items.push({ type: 'event', eventId: e.eventId, source: e.source, rawText: e.rawText })
    }
    return items
  }, [narrative, safeEvents])

  if (isLoading) {
    return (
      <AnimatedPage>
        <Skeleton className="h-64 w-full rounded-card" />
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/dashboard/companies/${cid}`}>
          <Button variant="ghost" size="sm" aria-label="Back to company">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to company
          </Button>
        </Link>
        <ExportAuditButton
          dataset={exportDataset}
          companyName={company?.name}
          metadata={{ narrativeId: nid, narrativeSummary: narrative?.summary }}
        />
      </div>

      <Card className="rounded-card card-pastel bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Narrative summary</CardTitle>
          <p className="text-foreground">{narrative?.summary ?? '—'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Contribution: {narrative?.contributionPercent ?? 0}%</span>
            <span>Persistence: {narrative?.persistenceScore ?? 0}</span>
            <span>Topic: {narrative?.topic ?? '—'}</span>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-card card-pastel bg-cardPastel-cream md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-serif text-lg">Contributing events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Impact-sorted. Open raw payload for audit.
            </p>
            <ScrollArea className="h-[400px]">
              <ul className="space-y-3 pr-4" role="list">
                {safeEvents.map((event: NarrativeEvent) => (
                  <li
                    key={event.eventId}
                    className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {event.speakerEntity ?? event.source} · {event.speakerRole ?? event.platform ?? '—'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {event.rawText ?? '—'}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {event.publishedAt ?? '—'} · {(event.canonicalTopics ?? []).join(', ') || '—'}
                        </p>
                      </div>
                      <Link
                        to={`/dashboard/raw-payload/${event.eventId}`}
                        className="shrink-0"
                        aria-label={`View raw payload for ${event.source}`}
                      >
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-card card-pastel bg-cardPastel-sage">
            <CardHeader>
              <CardTitle className="font-serif text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Authority & credibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Events are weighted by speaker authority (Analyst &gt; Media &gt; Retail).
                Credibility proxy combines management language and cross-source consistency.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-card card-pastel bg-cardPastel-wheat">
            <CardHeader>
              <CardTitle className="font-serif text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Risk snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Risk component (20% of IPI) reflects hedging language and uncertainty signals
                across contributing events.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  )
}
