import { api } from '@/lib/api'
import type { Narrative } from '@/types/narrative'

export const narrativesApi = {
  getTopByCompany: async (
    companyId: string,
    limit = 3,
    startDate?: string,
    endDate?: string
  ): Promise<Narrative[]> => {
    const params = new URLSearchParams({ limit: String(limit) })
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    return api.get<Narrative[]>(
      `/companies/${companyId}/narratives/top?${params}`
    )
  },

  getById: async (
    companyId: string,
    narrativeId: string
  ): Promise<Narrative> =>
    api.get<Narrative>(
      `/companies/${companyId}/narratives/${narrativeId}`
    ),

  listByCompany: async (
    companyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Narrative[]> => {
    const params = new URLSearchParams()
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const q = params.toString()
    return api.get<Narrative[]>(
      `/companies/${companyId}/narratives${q ? `?${q}` : ''}`
    )
  },
}
