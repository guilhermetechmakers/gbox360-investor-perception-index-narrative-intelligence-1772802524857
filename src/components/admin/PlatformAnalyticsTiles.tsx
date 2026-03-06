import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useUsageMetrics,
  useIngestionThroughput,
  useHealth,
} from '@/hooks/use-admin'
import { Users, Gauge, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const TILE_CONFIG = [
  {
    key: 'users',
    label: 'Active users',
    icon: Users,
    bg: 'bg-[#FBD8C5]/40',
    getValue: (metrics: { mau?: number } | null) => metrics?.mau ?? 0,
  },
  {
    key: 'throughput',
    label: 'Ingestion throughput',
    icon: Gauge,
    bg: 'bg-[#C8D4C0]/40',
    getValue: (data: { throughput?: number } | null) => data?.throughput ?? 0,
  },
  {
    key: 'uptime',
    label: 'Uptime',
    icon: Activity,
    bg: 'bg-[#E8DED3]/50',
    getValue: (data: { metrics?: { uptimePct?: number } } | null) =>
      data?.metrics?.uptimePct ?? 0,
  },
] as const

export function PlatformAnalyticsTiles() {
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics()
  const { data: throughput } = useIngestionThroughput()
  const { data: health } = useHealth()

  return (
    <Card className="rounded-card shadow-card">
      <CardHeader>
        <CardTitle className="font-serif text-lg">
          Platform analytics
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          At-a-glance health and usage metrics.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/admin/analytics"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg"
          >
            <div
              className={cn(
                'rounded-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
                TILE_CONFIG[0].bg
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {TILE_CONFIG[0].label}
                </p>
                <Users className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              {metricsLoading ? (
                <Skeleton className="mt-2 h-7 w-12" />
              ) : (
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {TILE_CONFIG[0].getValue(metrics ?? null)}
                </p>
              )}
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg"
          >
            <div
              className={cn(
                'rounded-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
                TILE_CONFIG[1].bg
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {TILE_CONFIG[1].label}
                </p>
                <Gauge className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {TILE_CONFIG[1].getValue(throughput ?? null)}
              </p>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg"
          >
            <div
              className={cn(
                'rounded-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
                TILE_CONFIG[2].bg
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {TILE_CONFIG[2].label}
                </p>
                <Activity className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {TILE_CONFIG[2].getValue(health ?? null)}%
              </p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
