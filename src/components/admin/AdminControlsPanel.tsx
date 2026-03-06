import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useIngestionHealth } from '@/hooks/use-admin'
import { IngestionReplaysPanel } from './IngestionReplaysPanel'
import {
  Server,
  Activity,
  HardDrive,
  RefreshCw,
  Users,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'h-5 w-5'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function HealthStatus({ value, threshold = 95, label }: { value: number; threshold?: number; label: string }) {
  const isHealthy = value >= threshold
  return (
    <div className="flex items-center gap-2">
      {isHealthy ? (
        <CheckCircle className="h-4 w-4 text-green-600" aria-hidden />
      ) : (
        <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
      )}
      <span className="text-sm font-medium text-foreground">{value}%</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function AdminControlsPanel() {
  const { data: health, isLoading } = useIngestionHealth()

  const uptimePct = typeof health?.uptimePct === 'number' ? health.uptimePct : 0
  const apiErrorRate = typeof health?.apiErrorRate === 'number' ? health.apiErrorRate : 0
  const storageUsedBytes = typeof health?.storageUsedBytes === 'number' ? health.storageUsedBytes : 0
  const errorRatePct = apiErrorRate * 100

  return (
    <div className="space-y-6">
      {/* System health overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-card bg-[#FBD8C5]/40 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Ingestion uptime
            </CardTitle>
            <Server className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <HealthStatus value={uptimePct} threshold={99} label="uptime" />
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#C8D4C0]/40 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              API error rate
            </CardTitle>
            <Activity className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{errorRatePct.toFixed(2)}%</span>
                <span className="text-xs text-muted-foreground">errors</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#E8DED3]/50 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Storage used
            </CardTitle>
            <HardDrive className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-sm font-medium text-foreground">
                {formatBytes(storageUsedBytes)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ingestion replays panel */}
      <IngestionReplaysPanel />

      {/* Quick actions */}
      <Card className="rounded-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-lg">Admin controls</CardTitle>
          <div className="flex gap-2">
            <Link to="/admin/ingestion">
              <Button variant="outline" size="sm" className="rounded-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Ingestion monitor
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline" size="sm" className="rounded-full">
                <Users className="mr-2 h-4 w-4" />
                User management
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">
              Trigger ingestion replays, view retry queue, and manage user access from the linked pages above.
              System health metrics are refreshed automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
