import { useQuery } from '@tanstack/react-query'
import { rawPayloadsApi } from '@/api/raw-payloads'

export const rawPayloadKeys = {
  detail: (id: string) => ['raw-payload', id] as const,
}

export function useRawPayload(id: string) {
  return useQuery({
    queryKey: rawPayloadKeys.detail(id),
    queryFn: () => rawPayloadsApi.getById(id),
    enabled: !!id,
  })
}
