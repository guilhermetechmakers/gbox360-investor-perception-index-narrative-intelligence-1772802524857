import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Download } from 'lucide-react'
import { useEventPayload } from '@/hooks/use-event-payload'
import { cn } from '@/lib/utils'
import type { EventPayloadMeta } from '@/types/company-detail'

export interface RawPayloadModalProps {
  eventId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  meta?: EventPayloadMeta
  className?: string
}

export function RawPayloadModal({
  eventId,
  open,
  onOpenChange,
  meta: metaProp,
  className,
}: RawPayloadModalProps) {
  const { data: payloadData, isLoading } = useEventPayload(eventId ?? '', open && !!eventId)

  const meta = metaProp ?? payloadData?.metadata
  const rawContent =
    typeof payloadData?.payload === 'string'
      ? payloadData.payload
      : JSON.stringify(payloadData?.payload ?? {}, null, 2)

  const handleDownload = () => {
    const blob = new Blob([rawContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payload-${eventId ?? 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('max-h-[90vh] max-w-2xl', className)}
        aria-labelledby="raw-payload-modal-title"
        aria-describedby="raw-payload-modal-desc"
      >
        <DialogHeader>
          <DialogTitle id="raw-payload-modal-title" className="font-serif text-lg">
            Raw payload
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {meta && (
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Source: {meta.source ?? '—'}</span>
              <span>Timestamp: {meta.timestamp ?? '—'}</span>
              {meta.jobId && <span>Job ID: {meta.jobId}</span>}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <ScrollArea className="h-[400px] w-full rounded-lg border border-border bg-muted/30 p-4">
              <pre
                id="raw-payload-modal-desc"
                className="whitespace-pre-wrap break-words font-mono text-xs text-foreground"
              >
                {rawContent}
              </pre>
            </ScrollArea>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
              aria-label="Download payload as JSON"
            >
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([rawContent], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `payload-${eventId ?? 'export'}.txt`
                a.click()
                URL.revokeObjectURL(url)
              }}
              disabled={isLoading}
              aria-label="Download payload as TXT"
            >
              Download TXT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
