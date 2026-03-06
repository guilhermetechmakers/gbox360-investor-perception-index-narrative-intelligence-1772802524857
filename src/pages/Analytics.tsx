import { useCallback } from 'react'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  AnalyticsDashboardLayout,
  MetricsCard,
  ReportBuilder,
  ScheduledReportsPanel,
} from '@/components/analytics'
import {
  useUsageMetrics,
  useIngestionThroughput,
  useFeatureAdoption,
  useScheduledReports,
  useDeleteScheduledReport,
  useUpdateScheduledReport,
  useCreateScheduledReport,
  useGenerateExport,
} from '@/hooks/use-admin'
import { Users, FileBarChart2, Gauge, LayoutTemplate } from 'lucide-react'

export default function Analytics() {
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics()
  const { data: throughput, isLoading: throughputLoading } = useIngestionThroughput()
  const { data: adoption, isLoading: adoptionLoading } = useFeatureAdoption()
  const { data: scheduledReports = [], isLoading: reportsLoading } = useScheduledReports()
  const deleteReport = useDeleteScheduledReport()
  const updateReport = useUpdateScheduledReport()
  const createReport = useCreateScheduledReport()
  const generateExport = useGenerateExport()

  const safeReports = Array.isArray(scheduledReports) ? scheduledReports : []

  const adoptionRate =
    adoption && typeof adoption === 'object'
      ? Object.values(adoption).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) /
        Math.max(1, Object.keys(adoption).length)
      : 0

  const handleExport = useCallback(
    async (params: {
      timeframe: string
      startDate?: string
      endDate?: string
      metrics: string[]
      format: 'CSV' | 'PDF'
    }) => {
      await generateExport.mutateAsync({
        timeframe: params.timeframe,
        metrics: params.metrics,
        format: params.format,
      })
    },
    [generateExport]
  )

  const handlePause = useCallback(
    (id: string) => {
      updateReport.mutate({ id, payload: { status: 'paused' } })
    },
    [updateReport]
  )

  const handleResume = useCallback(
    (id: string) => {
      updateReport.mutate({ id, payload: { status: 'active' } })
    },
    [updateReport]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteReport.mutate(id)
    },
    [deleteReport]
  )

  return (
    <AnimatedPage>
      <AnalyticsDashboardLayout
        title="Analytics & reports"
        subtitle="Platform and business metrics for leadership reviews. Export reports and manage scheduled exports."
      >
        <div className="space-y-8">
          {/* Metrics grid */}
          <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">
              Key metrics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricsCard
                title="Monthly Active Users"
                value={metrics?.mau ?? null}
                delta={5.2}
                hint="vs last month"
                colorTheme="cream"
                icon={Users}
                isLoading={metricsLoading}
              />
              <MetricsCard
                title="Queries per user"
                value={metrics?.queriesPerUser ?? null}
                unit=""
                hint="avg"
                colorTheme="sage"
                icon={FileBarChart2}
                isLoading={metricsLoading}
              />
              <MetricsCard
                title="Ingestion throughput"
                value={throughput?.throughput ?? metrics?.ingestionThroughput ?? null}
                delta={throughput?.delta}
                hint="events/day"
                colorTheme="wheat"
                icon={Gauge}
                isLoading={throughputLoading}
              />
              <MetricsCard
                title="Feature adoption"
                value={
                  adoptionRate > 0
                    ? `${Math.round(adoptionRate)}%`
                    : (metrics?.featureAdoption as unknown as number) ?? null
                }
                hint="avg across features"
                colorTheme="blush"
                icon={LayoutTemplate}
                isLoading={adoptionLoading}
              />
            </div>
          </section>

          {/* Report builder & Scheduled reports */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ReportBuilder onExport={handleExport} isLoading={metricsLoading} />
            <ScheduledReportsPanel
              reports={safeReports}
              isLoading={reportsLoading}
              onPause={handlePause}
              onResume={handleResume}
              onDelete={handleDelete}
              onCreate={(payload) =>
                createReport.mutate(payload, { onSuccess: () => {} })
              }
              onUpdate={(id, payload) =>
                updateReport.mutate({ id, payload })
              }
            />
          </div>
        </div>
      </AnalyticsDashboardLayout>
    </AnimatedPage>
  )
}
