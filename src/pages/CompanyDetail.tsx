import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { useCompany } from '@/hooks/use-companies'
import { useIPISnapshot, useIPITimeSeries } from '@/hooks/use-ipi'
import { useNarrativesList } from '@/hooks/use-narratives'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ExportAuditButton } from '@/components/dashboard'
import {
  CompanyDetailIPIHeader,
  IPIBreakdownPanel,
  NarrativeTimeline,
  NarrativeList,
  TimeWindowPicker,
  ComparePanel,
  SearchFilterBar,
  RawPayloadModal,
} from '@/components/company-detail'
import type { SearchFilterBarFilters } from '@/components/company-detail'

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

export default function CompanyDetail() {
  const { companyId } = useParams<{ companyId: string }>()
  const id = companyId ?? ''
  const [timeWindow, setTimeWindow] = useState('30d')
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [rawPayloadEventId, setRawPayloadEventId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilters, setSearchFilters] = useState<SearchFilterBarFilters>({
    timeWindow: '30d',
    source: 'all',
    role: 'all',
  })

  const { start: startDate, end: endDate } = getDateRangeForWindow(timeWindow)

  const { data: company, isLoading: companyLoading } = useCompany(id)
  const { data: snapshot, isLoading: snapshotLoading } = useIPISnapshot(
    id,
    startDate,
    endDate
  )
  const { data: timeSeries, isLoading: seriesLoading } = useIPITimeSeries(
    id,
    startDate,
    endDate
  )
  const { data: narratives, isLoading: narrativesLoading } = useNarrativesList(
    id,
    startDate,
    endDate
  )

  const windowRange = { start: startDate, end: endDate }

  const timelineData = useMemo(() => {
    const series = timeSeries ?? []
    return Array.isArray(series)
      ? series.map((p) => ({
          date: p.date,
          score: p.score,
          narrative: p.narrative,
          credibility: p.credibility,
          risk: p.risk,
        }))
      : []
  }, [timeSeries])

  const filteredNarratives = useMemo(() => {
    const list = narratives ?? []
    if (!Array.isArray(list)) return []
    let out = list
    const q = (searchQuery ?? '').trim().toLowerCase()
    if (q) {
      out = out.filter((n) => {
        const summary = (n?.summary ?? '').toLowerCase()
        const topic = (n?.topic ?? '').toLowerCase()
        const events = n?.events ?? []
        const eventText = events
          .map((e) => (e?.rawText ?? e?.source ?? '').toLowerCase())
          .join(' ')
        return summary.includes(q) || topic.includes(q) || eventText.includes(q)
      })
    }
    const src = searchFilters.source ?? 'all'
    const role = searchFilters.role ?? 'all'
    if (src !== 'all') {
      out = out.filter((n) => {
        const events = n?.events ?? []
        return events.some(
          (e) => (e?.source ?? '').toLowerCase().includes(src.toLowerCase())
        )
      })
    }
    if (role !== 'all') {
      out = out.filter((n) => {
        const events = n?.events ?? []
        return events.some(
          (e) => (e?.speakerRole ?? '').toLowerCase().includes(role.toLowerCase())
        )
      })
    }
    return out
  }, [narratives, searchQuery, searchFilters.source, searchFilters.role])

  const exportDataset = useMemo(() => {
    const items: unknown[] = []
    if (snapshot) items.push({ type: 'ipi', ...snapshot })
    for (const n of narratives ?? []) {
      items.push({ type: 'narrative', ...n })
    }
    return items
  }, [snapshot, narratives])

  const currentStats = useMemo(
    () => ({
      currentIpi: snapshot?.score ?? 0,
      delta: snapshot?.delta ?? 0,
      breakdown: {
        narrative: snapshot?.breakdown?.narrative ?? 0,
        credibility: snapshot?.breakdown?.credibility ?? 0,
        risk: snapshot?.breakdown?.risk ?? 0,
      },
    }),
    [snapshot]
  )

  const previousStats = useMemo((): { currentIpi: number; delta: number; breakdown: { narrative: number; credibility: number; risk: number } } | undefined => {
    if (!compareEnabled) return undefined
    return {
      currentIpi: (snapshot?.score ?? 0) - (snapshot?.delta ?? 0),
      delta: 0,
      breakdown: {
        narrative: Math.max(0, (snapshot?.breakdown?.narrative ?? 0) - 5),
        credibility: Math.max(0, (snapshot?.breakdown?.credibility ?? 0) - 3),
        risk: Math.max(0, (snapshot?.breakdown?.risk ?? 0) - 2),
      },
    }
  }, [compareEnabled, snapshot])

  const handleTimeWindowChange = (key: string, _range?: { start: string; end: string }) => {
    setTimeWindow(key)
    setSearchFilters((f) => ({ ...f, timeWindow: key }))
  }

  return (
    <AnimatedPage className="space-y-6">
      <CompanyDetailIPIHeader
        companyId={id}
        companyName={company?.name ?? 'Company'}
        ticker={company?.symbol}
        sector={company?.sector}
        isLoading={companyLoading}
      />

      <div className="flex flex-col gap-4">
        <SearchFilterBar
          query={searchQuery}
          filters={searchFilters}
          onQueryChange={setSearchQuery}
          onFiltersChange={(f) => {
            setSearchFilters(f)
            if (f.timeWindow) setTimeWindow(f.timeWindow)
          }}
          showTimeFilter={false}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TimeWindowPicker
            currentWindow={timeWindow}
            onChange={handleTimeWindowChange}
            compareEnabled={compareEnabled}
            onCompareToggle={setCompareEnabled}
          />
          <ExportAuditButton
            dataset={exportDataset}
            companyName={company?.name}
            timeWindow={timeWindow}
          />
        </div>
      </div>

      {snapshotLoading ? (
        <div className="h-48 animate-pulse rounded-card bg-muted/30" />
      ) : (
        <IPIBreakdownPanel
          narrativePct={snapshot?.breakdown?.narrative ?? 0}
          credibilityPct={snapshot?.breakdown?.credibility ?? 0}
          riskPct={snapshot?.breakdown?.risk ?? 0}
          totals={{
            narrative: snapshot?.breakdown?.narrative ?? 0,
            credibility: snapshot?.breakdown?.credibility ?? 0,
            risk: snapshot?.breakdown?.risk ?? 0,
          }}
        />
      )}

      {compareEnabled && previousStats && (
        <ComparePanel
          currentWindowStats={currentStats}
          previousWindowStats={previousStats}
        />
      )}

      <NarrativeTimeline
        events={timelineData}
        windowRange={windowRange}
        isLoading={seriesLoading}
      />

      <NarrativeList
        narratives={filteredNarratives}
        companyId={id}
        onOpenRawPayload={setRawPayloadEventId}
        isLoading={narrativesLoading}
      />

      <RawPayloadModal
        eventId={rawPayloadEventId}
        open={!!rawPayloadEventId}
        onOpenChange={(open) => !open && setRawPayloadEventId(null)}
      />
    </AnimatedPage>
  )
}
