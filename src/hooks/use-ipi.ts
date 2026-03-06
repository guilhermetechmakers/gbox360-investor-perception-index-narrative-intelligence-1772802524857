import { useQuery } from '@tanstack/react-query'
import { ipiApi } from '@/api/ipi'

export const ipiKeys = {
  snapshot: (companyId: string, start?: string, end?: string) =>
    ['ipi', 'snapshot', companyId, start, end] as const,
  series: (companyId: string, start?: string, end?: string) =>
    ['ipi', 'series', companyId, start, end] as const,
}

export function useIPISnapshot(
  companyId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ipiKeys.snapshot(companyId, startDate, endDate),
    queryFn: () =>
      ipiApi.getSnapshot(companyId, startDate, endDate),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useIPITimeSeries(
  companyId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ipiKeys.series(companyId, startDate, endDate),
    queryFn: () =>
      ipiApi.getTimeSeries(companyId, startDate, endDate),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })
}
