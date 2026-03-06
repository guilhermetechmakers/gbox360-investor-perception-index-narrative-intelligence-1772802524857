import { api } from '@/lib/api'
import type { IPISnapshot, IPITimeSeriesPoint } from '@/types/ipi'

export interface IPIQueryParams {
  companyId: string
  startDate?: string
  endDate?: string
}

export const ipiApi = {
  getSnapshot: async (
    companyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<IPISnapshot> => {
    const params = new URLSearchParams()
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const q = params.toString()
    return api.get<IPISnapshot>(
      `/companies/${companyId}/ipi${q ? `?${q}` : ''}`
    )
  },

  getTimeSeries: async (
    companyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<IPITimeSeriesPoint[]> => {
    const params = new URLSearchParams()
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const q = params.toString()
    return api.get<IPITimeSeriesPoint[]>(
      `/companies/${companyId}/ipi/series${q ? `?${q}` : ''}`
    )
  },
}
