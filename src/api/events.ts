import { api } from '@/lib/api'
import { rawPayloadsApi } from '@/api/raw-payloads'
import type { EventPayload } from '@/types/company-detail'

export const eventsApi = {
  /**
   * GET /api/events/{eventId}/payload or fallback to /raw-payloads/{eventId}
   */
  getPayload: async (eventId: string): Promise<EventPayload> => {
    try {
      const res = await api.get<{ payloadJson?: unknown; metadata?: EventPayload['metadata']; payload?: unknown }>(
        `/events/${eventId}/payload`
      )
      const payload = res?.payloadJson ?? res?.payload ?? {}
      const metadata = res?.metadata ?? { source: 'unknown', timestamp: new Date().toISOString() }
      return {
        eventId,
        payload: typeof payload === 'string' ? JSON.parse(payload) : payload,
        metadata: {
          source: metadata.source ?? 'unknown',
          timestamp: metadata.timestamp ?? new Date().toISOString(),
          mimeType: metadata.mimeType,
          jobId: metadata.jobId,
        },
      }
    } catch {
      const raw = await rawPayloadsApi.getById(eventId)
      return {
        eventId,
        payload: raw.payload ?? {},
        metadata: {
          source: raw.source ?? 'unknown',
          timestamp: raw.ingestTimestamp ?? new Date().toISOString(),
          mimeType: undefined,
          jobId: raw.jobId,
        },
      }
    }
  },
}
