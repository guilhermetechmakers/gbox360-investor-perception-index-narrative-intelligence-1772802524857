import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRawPayload } from '@/hooks/use-raw-payload'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ArrowLeft, Download } from 'lucide-react'

export default function RawPayloadViewer() {
  const { payloadId } = useParams<{ payloadId: string }>()
  const id = payloadId ?? ''

  const { data: payload, isLoading } = useRawPayload(id)

  if (isLoading) {
    return (
      <AnimatedPage>
        <Skeleton className="h-96 w-full rounded-card" />
      </AnimatedPage>
    )
  }

  const rawContent =
    typeof payload?.payload === 'string'
      ? payload.payload
      : JSON.stringify(payload?.payload ?? {}, null, 2)

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const blob = new Blob([rawContent], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `payload-${id}.json`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download JSON
        </Button>
      </div>

      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Raw payload</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Source: {payload?.source ?? '—'}</span>
            <span>Ingested: {payload?.ingestTimestamp ?? '—'}</span>
            <span>Job ID: {payload?.jobId ?? '—'}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full rounded-lg border border-border bg-muted/30 p-4">
            <pre className="text-xs text-foreground whitespace-pre-wrap break-words font-mono">
              {rawContent}
            </pre>
          </ScrollArea>
          {payload?.metadata && Object.keys(payload.metadata).length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground">Metadata</p>
              <pre className="mt-1 text-xs text-muted-foreground font-mono">
                {JSON.stringify(payload.metadata, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
