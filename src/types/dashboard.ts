/**
 * Dashboard-specific types for IPI overview, narratives, and recent events.
 * All types include null-safety for runtime guards.
 */

export interface NarrativeContribution {
  narrativeId: string
  title: string
  contribution: number
  sources: string[]
  topic?: string
}

export interface NarrativeEventSummary {
  id: string
  narrativeId?: string
  source: string
  speakerRole?: string
  timestamp?: string
  rawPayload?: unknown
  text?: string
  rawText?: string
}

export interface IPIResult {
  score: number
  delta: number
  lastUpdated: string
  breakdown?: {
    narrative: number
    credibility: number
    risk: number
  }
}

export interface TimeWindow {
  key: string
  label: string
  start?: string
  end?: string
}

export interface DashboardResponse {
  ipi: IPIResult | null
  topNarratives: NarrativeContribution[] | null
  recentEvents: NarrativeEventSummary[] | null
  status?: string
}

export const TIME_WINDOWS: TimeWindow[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: 'ytd', label: 'YTD' },
]
