import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ipiApi } from '@/api/ipi'
import { narrativesApi } from '@/api/narratives'
import { getDateRangeForWindow } from '@/components/company-detail'
import type { Narrative } from '@/types/narrative'
import type { IPITimeSeriesPoint } from '@/types/ipi'

export const companyDetailKeys = {
  ipi: (companyId: string, start?: string, end?: string) =>
    ['company-detail', 'ipi', companyId, start, end] as const,
  narratives: (
    companyId: string,
    start?: string,
    end?: string,
    search?: string,
    source?: string,
    role?: string
  ) =>
    ['company-detail', 'narratives', companyId, start, end, search, source, role] as const,
}

export function useCompanyDetailIPI(
  companyId: string,
  timeWindowKey: string
) {
  const { start, end } = getDateRangeForWindow(timeWindowKey)

  const snapshotQuery = useQuery({
    queryKey: ['ipi', 'snapshot', companyId, start, end],
    queryFn: () => ipiApi.getSnapshot(companyId, start, end),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })

  const seriesQuery = useQuery({
    queryKey: ['ipi', 'series', companyId, start, end],
    queryFn: () => ipiApi.getTimeSeries(companyId, start, end),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })

  const narrativesQuery = useQuery({
    queryKey: companyDetailKeys.narratives(companyId, start, end),
    queryFn: () => narrativesApi.listByCompany(companyId, start, end),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })

  const snapshot = snapshotQuery.data
  const timeSeries = seriesQuery.data ?? []
  const narratives = narrativesQuery.data ?? []

  const timelineEvents = useMemo(() => {
    const series = Array.isArray(timeSeries) ? timeSeries : []
    return series.map((p: IPITimeSeriesPoint) => ({
      date: p.date,
      score: p.score,
      narrative: p.narrative,
      credibility: p.credibility,
      risk: p.risk,
    }))
  }, [timeSeries])

  const filteredNarratives = useMemo(() => {
    const list = Array.isArray(narratives) ? narratives : []
    return list as Narrative[]
  }, [narratives])

  return {
    snapshot,
    timeSeries,
    timelineEvents,
    narratives: filteredNarratives,
    window: { start, end },
    isLoading:
      snapshotQuery.isLoading ||
      seriesQuery.isLoading ||
      narrativesQuery.isLoading,
    isError: snapshotQuery.isError || narrativesQuery.isError,
    error: snapshotQuery.error ?? narrativesQuery.error,
  }
}
