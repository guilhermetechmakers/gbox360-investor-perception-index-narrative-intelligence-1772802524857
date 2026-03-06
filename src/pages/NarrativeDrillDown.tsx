import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNarrative } from '@/hooks/use-narratives'
import { AnimatedPage } from '@/components/AnimatedPage'
import { FileText, Download, ArrowLeft } from 'lucide-react'
import type { NarrativeEvent } from '@/types/narrative'

export default function NarrativeDrillDown() {
  const { companyId, narrativeId } = useParams<{
    companyId: string
    narrativeId: string
  }>()
  const cid = companyId ?? ''
  const nid = narrativeId ?? ''

  const { data: narrative, isLoading } = useNarrative(cid, nid)

  if (isLoading) {
    return (
      <AnimatedPage>
        <Skeleton className="h-64 w-full rounded-card" />
      </AnimatedPage>
    )
  }

  const events = narrative?.events ?? []

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/dashboard/companies/${cid}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to company
          </Button>
        </Link>
      </div>

      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Narrative summary</CardTitle>
          <p className="text-foreground">{narrative?.summary ?? '—'}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Contribution: {narrative?.contributionPercent ?? 0}%</span>
            <span>Persistence: {narrative?.persistenceScore ?? 0}</span>
            <span>Topic: {narrative?.topic ?? '—'}</span>
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-serif text-lg">Contributing events</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export artifact
          </Button>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Impact-sorted. Open raw payload for audit.
          </p>
          <ScrollArea className="h-[400px]">
            <ul className="space-y-3 pr-4">
              {events.map((event: NarrativeEvent) => (
                <li
                  key={event.eventId}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {event.speakerEntity ?? event.source} · {event.speakerRole ?? event.platform}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {event.rawText}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {event.publishedAt} · {event.canonicalTopics?.join(', ')}
                      </p>
                    </div>
                    <Link
                      to={`/dashboard/raw-payload/${event.eventId}`}
                      className="shrink-0"
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
    </AnimatedPage>
  )
}
