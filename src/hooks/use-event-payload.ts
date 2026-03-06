import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@/api/events'

export const eventPayloadKeys = {
  detail: (eventId: string) => ['event-payload', eventId] as const,
}

export function useEventPayload(eventId: string, enabled = true) {
  return useQuery({
    queryKey: eventPayloadKeys.detail(eventId),
    queryFn: () => eventsApi.getPayload(eventId),
    enabled: !!eventId && enabled,
  })
}
