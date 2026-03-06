/**
 * Canonical NarrativeEvent model for Gbox360.
 * Immutable, append-only schema. Events are never mutated after creation.
 */
import type { NarrativeEvent, NarrativeEventInput } from '@/types/historical-comparison'

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Create a new NarrativeEvent from input. Returns immutable event.
 */
export function createEvent(input: NarrativeEventInput): NarrativeEvent {
  const now = new Date().toISOString()
  const timestamps = input.timestamps ?? {
    createdAt: now,
    eventAt: now,
  }
  return {
    id: input.id ?? generateId(),
    sourcePlatform: input.sourcePlatform ?? 'unknown',
    speaker: input.speaker ?? { name: 'Unknown' },
    audienceClass: input.audienceClass ?? 'general',
    rawText: input.rawText ?? '',
    timestamps: {
      createdAt: timestamps.createdAt ?? now,
      eventAt: timestamps.eventAt ?? timestamps.createdAt ?? now,
    },
    payloadReference: input.payloadReference ?? '',
  }
}

/**
 * Validate a NarrativeEvent. Returns true if valid.
 */
export function validateEvent(event: unknown): event is NarrativeEvent {
  if (!event || typeof event !== 'object') return false
  const e = event as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.sourcePlatform === 'string' &&
    typeof e.rawText === 'string' &&
    e.timestamps != null &&
    typeof (e.timestamps as Record<string, unknown>).createdAt === 'string'
  )
}

/**
 * Serialize event for audit export. Returns plain object, never mutates input.
 */
export function serializeForAudit(event: NarrativeEvent): Record<string, unknown> {
  return {
    id: event.id,
    sourcePlatform: event.sourcePlatform,
    speaker: { ...event.speaker },
    audienceClass: event.audienceClass,
    rawText: event.rawText,
    timestamps: { ...event.timestamps },
    payloadReference: event.payloadReference,
    topics: Array.isArray(event.topics) ? [...event.topics] : [],
  }
}
