import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Users, FileBarChart2, Gauge, LayoutTemplate } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Empty state for a metric card: icon, message, optional CTA */
function MetricEmptyState({
  message,
  description,
  actionLabel,
  onAction,
  className,
}: {
  message: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-4 text-center',
        className
      )}
      aria-live="polite"
    >
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-[200px]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-1"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

/** Single metric card with value or empty state */
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
    <Card className="rounded-2xl shadow-card transition-all duration-200 hover:shadow-card-hover">
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
          <MetricEmptyState
            message={emptyMessage}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default function Analytics() {
  // Placeholder for future API: activeUsers, exportsCount, slaPercent
  const activeUsers: number | null = null
  const exportsCount: number | null = null
  const slaPercent: number | null = null

  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Analytics & reports
      </h1>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <MetricCard
          title="Active users"
          value={activeUsers}
          subLabel="Key metric"
          icon={Users}
          emptyMessage="No data yet"
          emptyDescription="Active user counts will appear once tracking is enabled."
          emptyActionLabel="View settings"
          onEmptyAction={() => {}}
        />
        <MetricCard
          title="Exports"
          value={exportsCount}
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
      <Card className="rounded-2xl shadow-card transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <LayoutTemplate className="h-5 w-5 text-muted-foreground" aria-hidden />
            Report builder
          </CardTitle>
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
                Create and schedule reports to track adoption and operational SLAs. Reports will appear here once configured.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              Create report
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
