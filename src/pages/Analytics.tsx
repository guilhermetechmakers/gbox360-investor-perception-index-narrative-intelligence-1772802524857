import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAnalyticsUsage } from '@/hooks/use-admin'
import {
  Users,
  FileBarChart2,
  Gauge,
  LayoutTemplate,
  Download,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { toast } from 'sonner'

const PASTEL_COLORS = ['#FBD8C5', '#E8DED3', '#C8D4C0', '#D8C9B0', '#E6C9C2']

function MetricCard({
  title,
  value,
  subLabel,
  icon: Icon,
  emptyMessage,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
}: {
  title: string
  value: number | string | null | undefined
  subLabel: string
  icon: React.ComponentType<{ className?: string }>
  emptyMessage: string
  emptyDescription?: string
  emptyActionLabel?: string
  onEmptyAction?: () => void
}) {
  const hasValue = value !== null && value !== undefined && value !== ''
  return (
    <Card className="rounded-card shadow-card transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasValue ? (
          <>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{subLabel}</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
            {emptyDescription && (
              <p className="text-xs text-muted-foreground max-w-[200px]">{emptyDescription}</p>
            )}
            {emptyActionLabel && onEmptyAction && (
              <Button type="button" variant="outline" size="sm" onClick={onEmptyAction}>
                {emptyActionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Analytics() {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')
  const { data: metrics = {}, isLoading } = useAnalyticsUsage()

  const activeUsers = metrics?.activeUsers ?? null
  const exportsCount = metrics?.exportsCount ?? null
  const slaPercent = metrics?.slaPercent ?? null
  const ingestionThroughput = metrics?.ingestionThroughput ?? null
  const featureAdoption = metrics?.featureAdoption ?? null

  const chartData = [
    { name: 'Active users', value: activeUsers ?? 0, fill: PASTEL_COLORS[0] },
    { name: 'Exports', value: exportsCount ?? 0, fill: PASTEL_COLORS[1] },
    { name: 'Ingestion', value: ingestionThroughput ?? 0, fill: PASTEL_COLORS[2] },
  ].filter((d) => d.value > 0)

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      metrics: {
        activeUsers,
        exportsCount,
        slaPercent,
        ingestionThroughput,
        featureAdoption,
      },
    }
    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const rows = [
        ['Metric', 'Value'],
        ['Active users', String(activeUsers ?? '')],
        ['Exports count', String(exportsCount ?? '')],
        ['SLA %', slaPercent != null ? `${slaPercent}%` : ''],
        ['Ingestion throughput', String(ingestionThroughput ?? '')],
        ['Feature adoption %', featureAdoption != null ? `${featureAdoption}%` : ''],
      ]
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    toast.success(`Report exported as ${exportFormat.toUpperCase()}`)
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Analytics & reports
        </h1>
        <div className="flex items-center gap-2">
          <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'csv' | 'json')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <MetricCard
          title="Active users"
          value={isLoading ? null : activeUsers}
          subLabel="Key metric"
          icon={Users}
          emptyMessage="No data yet"
          emptyDescription="Active user counts will appear once tracking is enabled."
          emptyActionLabel="View settings"
          onEmptyAction={() => {}}
        />
        <MetricCard
          title="Exports"
          value={isLoading ? null : exportsCount}
          subLabel="This period"
          icon={FileBarChart2}
          emptyMessage="No exports yet"
          emptyDescription="Export counts will show here for the selected period."
          emptyActionLabel="Export audit"
          onEmptyAction={() => {}}
        />
        <MetricCard
          title="SLA"
          value={slaPercent != null ? `${slaPercent}%` : null}
          subLabel="Operational"
          icon={Gauge}
          emptyMessage="No SLA data yet"
          emptyDescription="SLA metrics will appear when ingestion and reports are running."
          emptyActionLabel="Ingestion monitor"
          onEmptyAction={() => {}}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <LayoutTemplate className="h-5 w-5 text-muted-foreground" aria-hidden />
              Usage overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Platform usage metrics for leadership reviews.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : chartData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-muted-foreground">No chart data available yet.</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis type="number" stroke="rgb(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" width={100} stroke="rgb(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(var(--card))',
                        border: '1px solid rgb(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="rgb(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-card shadow-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Report builder</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create and schedule reports for adoption and operational SLAs.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
                aria-hidden
              >
                <LayoutTemplate className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Scheduled reports and report builder
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Create and schedule reports to track adoption and operational SLAs. Reports will
                  appear here once configured.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm">
                Create report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
