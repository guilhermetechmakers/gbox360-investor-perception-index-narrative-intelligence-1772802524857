import { useState, useMemo } from 'react'
import { useCompanies, useCompanySearch } from '@/hooks/use-companies'
import { useIPITimeSeries } from '@/hooks/use-ipi'
import { useDashboard } from '@/hooks/use-dashboard'
import { AnimatedPage } from '@/components/AnimatedPage'
import { IPIOverviewCard } from './IPIOverviewCard'
import { TopNarrativesPanel } from './TopNarrativesPanel'
import { RecentActivityFeed } from './RecentActivityFeed'
import { QuickSearchBar } from './QuickSearchBar'
import { FilterBar } from './FilterBar'
import { ExportAuditButton } from './ExportAuditButton'
import { EmptyState } from './EmptyState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, subDays } from 'date-fns'

function getDateRangeForWindow(key: string): { start: string; end: string } {
  const end = new Date()
  let start: Date
  if (key === '7d') start = subDays(end, 7)
  else if (key === 'ytd') start = new Date(end.getFullYear(), 0, 1)
  else start = subDays(end, 30)
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  }
}

export interface DashboardContainerProps {
  selectedCompanyId?: string
  timeWindow?: string
  onCompanyChange?: (id: string) => void
  onTimeWindowChange?: (key: string) => void
}

export function DashboardContainer({
  selectedCompanyId: controlledCompanyId,
  timeWindow: controlledTimeWindow = '30d',
  onCompanyChange,
  onTimeWindowChange,
}: DashboardContainerProps) {
  const [internalCompanyId, setInternalCompanyId] = useState('')
  const [internalTimeWindow, setInternalTimeWindow] = useState(controlledTimeWindow)
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const companyId = controlledCompanyId ?? internalCompanyId
  const timeWindow = controlledTimeWindow ?? internalTimeWindow

  const { data: companies } = useCompanies()
  const { data: searchResults } = useCompanySearch(searchQuery)
  const displayCompanies = searchQuery.length >= 2 ? searchResults : companies
  const effectiveCompanyId = companyId || (companies?.[0]?.id ?? '')

  const { data: dashboardData, isLoading, isError } = useDashboard(
    effectiveCompanyId,
    timeWindow
  )

  const { start, end } = getDateRangeForWindow(timeWindow)
  const { data: timeSeries } = useIPITimeSeries(
    effectiveCompanyId,
    start,
    end
  )

  const ipi = dashboardData?.ipi ?? null
  const rawTopNarratives = dashboardData?.topNarratives ?? []
  const rawRecentEvents = dashboardData?.recentEvents ?? []

  const topNarratives = useMemo(() => {
    if (sourceFilter === 'all' && roleFilter === 'all') return rawTopNarratives
    return rawTopNarratives.filter((n) => {
      if (sourceFilter !== 'all') {
        const sources = n?.sources ?? []
        const hasSource = sources.some(
          (s) => s.toLowerCase().includes(sourceFilter.toLowerCase())
        )
        if (!hasSource) return false
      }
      return true
    })
  }, [rawTopNarratives, sourceFilter, roleFilter])

  const recentEvents = useMemo(() => {
    if (sourceFilter === 'all' && roleFilter === 'all') return rawRecentEvents
    return rawRecentEvents.filter((e) => {
      if (sourceFilter !== 'all') {
        const src = (e?.source ?? '').toLowerCase()
        if (!src.includes(sourceFilter.toLowerCase())) return false
      }
      if (roleFilter !== 'all') {
        const role = (e?.speakerRole ?? '').toLowerCase()
        if (!role.includes(roleFilter.toLowerCase())) return false
      }
      return true
    })
  }, [rawRecentEvents, sourceFilter, roleFilter])

  const sparklineData = useMemo(() => {
    const series = timeSeries ?? []
    return Array.isArray(series)
      ? series.map((p) => ({
          date: 'date' in p ? format(new Date((p as { date: string }).date), 'MMM d') : String(p),
          score: (p as { score: number }).score ?? 0,
        }))
      : []
  }, [timeSeries])

  const exportDataset = useMemo(() => {
    const items: unknown[] = []
    if (ipi) {
      items.push({ type: 'ipi', ...ipi })
    }
    for (const n of topNarratives ?? []) {
      items.push({ type: 'narrative', ...n })
    }
    for (const e of recentEvents ?? []) {
      items.push({ type: 'event', ...e })
    }
    return items
  }, [ipi, topNarratives, recentEvents])

  const selectedCompany = (displayCompanies ?? []).find((c) => c.id === effectiveCompanyId)
  const hasNoCompanies = !(companies ?? []).length
  const hasNoData = !ipi && (topNarratives ?? []).length === 0 && (recentEvents ?? []).length === 0
  const showEmptyState =
    (effectiveCompanyId && (hasNoData || isError) && !isLoading) ||
    (hasNoCompanies && !isLoading)

  const handleCompanyChange = (id: string) => {
    if (onCompanyChange) onCompanyChange(id)
    else setInternalCompanyId(id)
  }

  const handleTimeWindowChange = (key: string) => {
    if (onTimeWindowChange) onTimeWindowChange(key)
    else setInternalTimeWindow(key)
  }

  return (
    <AnimatedPage className="space-y-6">
      {/* Global top bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <QuickSearchBar
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
          <Select
            value={effectiveCompanyId}
            onValueChange={handleCompanyChange}
          >
            <SelectTrigger className="w-[200px]" aria-label="Select company">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {(displayCompanies ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} {c.symbol ? `(${c.symbol})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FilterBar
            timeWindow={timeWindow}
            setTimeWindow={handleTimeWindowChange}
            selectedSource={sourceFilter}
            setSelectedSource={setSourceFilter}
            selectedRole={roleFilter}
            setSelectedRole={setRoleFilter}
          />
          <ExportAuditButton
            dataset={exportDataset}
            companyName={selectedCompany?.name}
            timeWindow={timeWindow}
          />
        </div>
      </div>

      {showEmptyState ? (
        <EmptyState
          reason={hasNoCompanies ? 'No companies available' : 'No data for this company and time window'}
          guidance={
            hasNoCompanies
              ? 'Add companies or contact your administrator to get started.'
              : 'Try selecting a different company or time window. If you recently ingested data, it may take a moment to appear.'
          }
          ingestionStatus={isError ? 'error' : 'idle'}
        />
      ) : (
        <>
          <IPIOverviewCard
            ipiScore={ipi?.score}
            delta={ipi?.delta}
            lastUpdated={ipi?.lastUpdated}
            sparklineData={sparklineData}
            isLoading={isLoading}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TopNarrativesPanel
              narratives={topNarratives}
              companyId={effectiveCompanyId}
              isLoading={isLoading}
            />
            <RecentActivityFeed
              events={recentEvents}
              isLoading={isLoading}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            IPI weights are provisional and visible in exports. Raw payloads are
            preserved for audit.
          </p>
        </>
      )}
    </AnimatedPage>
  )
}
