import { useQuery } from '@tanstack/react-query'
import { narrativesApi } from '@/api/narratives'

export const narrativeKeys = {
  top: (companyId: string, limit: number, start?: string, end?: string) =>
    ['narratives', 'top', companyId, limit, start, end] as const,
  detail: (companyId: string, narrativeId: string) =>
    ['narratives', 'detail', companyId, narrativeId] as const,
  list: (companyId: string, start?: string, end?: string) =>
    ['narratives', 'list', companyId, start, end] as const,
}

export function useTopNarratives(
  companyId: string,
  limit = 3,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: narrativeKeys.top(companyId, limit, startDate, endDate),
    queryFn: () =>
      narrativesApi.getTopByCompany(companyId, limit, startDate, endDate),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useNarrative(companyId: string, narrativeId: string) {
  return useQuery({
    queryKey: narrativeKeys.detail(companyId, narrativeId),
    queryFn: () => narrativesApi.getById(companyId, narrativeId),
    enabled: !!companyId && !!narrativeId,
  })
}

export function useNarrativesList(
  companyId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: narrativeKeys.list(companyId, startDate, endDate),
    queryFn: () =>
      narrativesApi.listByCompany(companyId, startDate, endDate),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })
}
