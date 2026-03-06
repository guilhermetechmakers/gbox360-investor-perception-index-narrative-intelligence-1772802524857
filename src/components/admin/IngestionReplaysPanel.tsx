import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useIngestionReplays } from '@/hooks/use-admin'
import { RefreshCw, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export function IngestionReplaysPanel() {
  const { data, isLoading } = useIngestionReplays()
  const replays = Array.isArray(data?.data) ? data.data : []

  const statusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" aria-hidden />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
      case 'in_progress':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden />
      default:
        return null
    }
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'failed':
        return 'destructive'
      case 'in_progress':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="rounded-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-lg">Ingestion replays</CardTitle>
        <Link to="/admin/ingestion">
          <Button variant="outline" size="sm" className="rounded-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Monitor
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : replays.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60">
              <RefreshCw className="h-5 w-5 text-muted-foreground" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">No ingestion runs yet</p>
              <p className="text-sm text-muted-foreground">
                Ingestion status and retry controls appear in the Ingestion Monitor.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {replays.map((r) => (
              <div
                key={r?.id ?? ''}
                className={cn(
                  'flex items-center justify-between rounded-lg border border-border/60 p-3 transition-all duration-200 hover:shadow-card',
                  'bg-[#FFFFFF]'
                )}
              >
                <div className="flex items-center gap-3">
                  {statusIcon(r?.status ?? '')}
                  <div>
                    <p className="text-sm font-medium text-foreground">{r?.source ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">
                      {r?.last_attempt_at
                        ? formatDistanceToNow(new Date(r.last_attempt_at), { addSuffix: true })
                        : '—'}
                    </p>
                  </div>
                </div>
                <Badge variant={statusVariant(r?.status ?? '')}>
                  {r?.status ?? '—'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
