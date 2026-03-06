/**
 * Historical Comparison types for IPI and narrative persistence across windows/peers.
 * All types include null-safety for runtime guards.
 */

export interface NarrativeEventSpeaker {
  name: string
  role?: string
}

export interface NarrativeEventTimestamps {
  createdAt: string
  eventAt?: string
}

/** Canonical immutable NarrativeEvent schema (append-only semantics) */
export interface NarrativeEvent {
  id: string
  sourcePlatform: string
  speaker: NarrativeEventSpeaker
  audienceClass: string
  rawText: string
  timestamps: NarrativeEventTimestamps
  payloadReference: string
  /** Topics assigned by classifier; always [] if none */
  topics?: string[]
}

export interface IPIComponents {
  narrative: number
  credibility: number
  risk: number
  total: number
  decayFactor: number
}

export interface HistoricalWindow {
  id: string
  label: string
  dateRange: string
}

export interface Peer {
  id: string
  name: string
  description?: string
}

export interface HistoricalComparisonData {
  windows: HistoricalWindow[]
  peers: Peer[]
  narratives: NarrativeEvent[]
  ipi: IPIComponents[]
}

export interface ExportPayload {
  companyId: string
  companyName?: string
  windowId?: string
  windowLabel?: string
  peerId?: string
  peerName?: string
  ipi: IPIComponents
  narratives: NarrativeEvent[]
  exportedAt: string
}

export interface DecayConfig {
  halfLifeDays: number
  referenceDate?: string
}
