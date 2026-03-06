/**
 * Historical Comparison types for Gbox360 IPI and narrative persistence.
 * All types include null-safety for runtime guards.
 */

/** Canonical NarrativeEvent schema (immutable, append-only) */
export interface NarrativeEvent {
  id: string
  sourcePlatform: string
  speaker: { name: string; role?: string }
  audienceClass: string
  rawText: string
  timestamps: { createdAt: string; eventAt?: string }
  payloadReference: string
  /** Topics assigned by lightweight classifier */
  topics?: string[]
}

/** IPI component breakdown with provisional weights */
export interface IPIComponents {
  narrative: number
  credibility: number
  risk: number
  total: number
  decayFactor: number
}

/** Historical window for comparison */
export interface HistoricalWindow {
  id: string
  label: string
  dateRange: string
}

/** Peer for benchmarking */
export interface Peer {
  id: string
  name: string
  description?: string
}

/** Decay configuration for narrative persistence */
export interface DecayConfig {
  halfLifeDays: number
  /** Decay factor applied to narrative component (0–1) */
  decayFactor: number
}

/** Input for creating a NarrativeEvent */
export interface NarrativeEventInput {
  id?: string
  sourcePlatform: string
  speaker?: { name: string; role?: string }
  audienceClass?: string
  rawText: string
  timestamps?: { createdAt: string; eventAt?: string }
  payloadReference?: string
}

/** Export payload for audit artifacts */
export interface ExportPayload {
  companyId?: string
  companyName?: string
  windowId?: string
  windowLabel?: string
  peerId?: string
  peerName?: string
  exportedAt: string
  ipi?: IPIComponents
  narratives: Array<{
    event: NarrativeEvent
    impact?: number
  }>
  metadata?: Record<string, unknown>
}
