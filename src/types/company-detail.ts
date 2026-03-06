/**
 * Company Detail & IPI types.
 * Aligned with Gbox360 narrative model and runtime safety rules.
 */

export interface NarrativeEventDetail {
  id: string
  source: string
  platform: string
  speaker: string
  role?: string
  audienceClass?: string
  rawText?: string
  timestamp?: string
  eventId?: string
}

export interface NarrativeDetail {
  id: string
  title: string
  weight: number
  credibilityProxy: number
  contributingEventIds: string[]
}

export interface EventPayloadMeta {
  source: string
  timestamp: string
  mimeType?: string
  jobId?: string
}

export interface EventPayload {
  eventId: string
  payload: unknown
  metadata: EventPayloadMeta
}

export interface IPIResultDetail {
  currentIpi: number
  delta: number
  breakdown: {
    narrative: number
    credibility: number
    risk: number
  }
}

export interface WindowRange {
  start: string
  end: string
}

export interface CompareStats {
  currentIpi: number
  delta: number
  breakdown: { narrative: number; credibility: number; risk: number }
}
