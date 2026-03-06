import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AuditLog } from '@/types/admin'
import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'

export interface AuditLogCardProps {
  log: AuditLog
  className?: string
}

export function AuditLogCard({ log, className }: AuditLogCardProps) {
  const timestamp = log?.timestamp
    ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })
    : '—'

  return (
    <Card
      className={cn(
        'rounded-card border-border/80 bg-card transition-all duration-200 hover:shadow-card-hover',
        className
      )}
    >
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60">
            <Activity className="h-4 w-4 text-muted-foreground" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              <span className="font-semibold">{log?.action ?? '—'}</span>
              {log?.details && (
                <span className="ml-1 text-muted-foreground">— {log.details}</span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {log?.targetType ?? '—'} · {log?.targetId ?? '—'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
