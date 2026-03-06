import { api } from '@/lib/api'
import type { RawPayload } from '@/types/raw-payload'

export const rawPayloadsApi = {
  getById: async (id: string): Promise<RawPayload> =>
    api.get<RawPayload>(`/raw-payloads/${id}`),
}
