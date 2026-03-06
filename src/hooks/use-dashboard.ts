import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  view: (companyId: string, timeWindow: string) =>
    [...dashboardKeys.all, companyId, timeWindow] as const,
}

export function useDashboard(companyId: string, timeWindow: string) {
  return useQuery({
    queryKey: dashboardKeys.view(companyId, timeWindow),
    queryFn: () => dashboardApi.getDashboard(companyId, timeWindow),
    enabled: !!companyId && !!timeWindow,
    staleTime: 1000 * 60 * 5,
  })
}
