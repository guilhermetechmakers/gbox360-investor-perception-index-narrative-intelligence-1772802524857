import { api } from '@/lib/api'
import type { Narrative, NarrativeEvent } from '@/types/narrative'
import type { RawPayload } from '@/types/raw-payload'

export interface CompanyIPIResponse {
  currentIpi: number
  delta: number
  breakdown: { narrative: number; credibility: number; risk: number }
  narratives: Narrative[]
  events: NarrativeEvent[]
  window: { start: string; end: string }
}

export interface NarrativesQueryParams {
  start?: string
  end?: string
  search?: string
  source?: string
  role?: string
}

export const companyDetailApi = {
  getIPI: async (
    companyId: string,
    start?: string,
    end?: string
  ): Promise<CompanyIPIResponse> => {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    const q = params.toString()
    return api.get<CompanyIPIResponse>(
      `/companies/${companyId}/ipi${q ? `?${q}` : ''}`
    )
  },

  getNarratives: async (
    companyId: string,
    params?: NarrativesQueryParams
  ): Promise<Narrative[]> => {
    const searchParams = new URLSearchParams()
    if (params?.start) searchParams.set('start', params.start)
    if (params?.end) searchParams.set('end', params.end)
    if (params?.search) searchParams.set('q', params.search)
    if (params?.source) searchParams.set('source', params.source)
    if (params?.role) searchParams.set('role', params.role)
    const q = searchParams.toString()
    const list = await api.get<Narrative[]>(
      `/companies/${companyId}/narratives${q ? `?${q}` : ''}`
    )
    return Array.isArray(list) ? list : []
  },

  getNarrativeEvents: async (
    companyId: string,
    narrativeId: string
  ): Promise<NarrativeEvent[]> => {
    const narrative = await api.get<Narrative & { events?: NarrativeEvent[] }>(
      `/companies/${companyId}/narratives/${narrativeId}`
    )
    const events = narrative?.events ?? []
    return Array.isArray(events) ? events : []
  },

  getEventPayload: async (eventId: string): Promise<RawPayload | null> => {
    try {
      return await api.get<RawPayload>(`/raw-payloads/${eventId}`)
    } catch {
      return null
    }
  },

  exportAudit: async (
    companyId: string,
    windowStart: string,
    windowEnd: string,
    data: {
      breakdown: { narrative: number; credibility: number; risk: number }
      narratives: unknown[]
      events: unknown[]
    }
  ): Promise<Blob> => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/audit/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
        },
        body: JSON.stringify({
          companyId,
          windowStart,
          windowEnd,
          data,
        }),
      }
    )
    if (!res.ok) throw new Error('Export failed')
    return res.blob()
  },
}
