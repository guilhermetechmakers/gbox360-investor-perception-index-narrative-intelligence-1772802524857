import { useQuery } from '@tanstack/react-query'
import { historicalComparisonApi } from '@/api/historical-comparison'

export const historicalComparisonKeys = {
  all: ['historical-comparison'] as const,
  data: (companyId: string, windowId?: string, peerId?: string) =>
    [...historicalComparisonKeys.all, companyId, windowId, peerId] as const,
}

export function useHistoricalComparison(
  companyId: string,
  windowId?: string,
  peerId?: string
) {
  return useQuery({
    queryKey: historicalComparisonKeys.data(companyId, windowId, peerId),
    queryFn: () =>
      historicalComparisonApi.getData(companyId, windowId, peerId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  })
}
