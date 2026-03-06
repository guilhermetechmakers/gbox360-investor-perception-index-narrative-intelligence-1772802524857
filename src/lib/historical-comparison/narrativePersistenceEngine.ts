/**
 * NarrativePersistenceEngine for Gbox360.
 * Applies exponential decay per narrative event over time.
 * Safeguards: validate arrays; guard when missing dates.
 */
import type { NarrativeEvent } from '@/types/historical-comparison'
import type { DecayConfig } from '@/types/historical-comparison'

function safeDate(ts: string | undefined | null): Date | null {
  if (ts == null || typeof ts !== 'string') return null
  const d = new Date(ts)
  return Number.isFinite(d.getTime()) ? d : null
}

/**
 * Compute exponential decay factor for an event at eventDate relative to referenceDate.
 * halfLifeDays: days after which contribution is halved.
 */
function decayFactor(
  eventDate: Date,
  referenceDate: Date,
  halfLifeDays: number
): number {
  if (halfLifeDays <= 0) return 1
  const diffMs = referenceDate.getTime() - eventDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays <= 0) return 1
  const lambda = Math.LN2 / halfLifeDays
  return Math.exp(-lambda * diffDays)
}

export interface TimeDecayedCount {
  date: string
  count: number
  decayedContribution: number
}

/**
 * Compute narrative persistence score and time-decayed counts.
 * Returns { persistenceScore, timeDecayedCounts }.
 */
export function computePersistence(
  narratives: NarrativeEvent[] | null | undefined,
  decayConfig: DecayConfig
): { persistenceScore: number; timeDecayedCounts: TimeDecayedCount[] } {
  const items = Array.isArray(narratives) ? narratives : []
  const halfLife = decayConfig?.halfLifeDays ?? 30
  const refDate = new Date()

  const byDate = new Map<string, { count: number; totalDecay: number }>()

  for (const n of items) {
    const eventAt = n?.timestamps?.eventAt ?? n?.timestamps?.createdAt
    const d = safeDate(eventAt)
    if (d === null || !eventAt || String(eventAt).trim() === '') continue
    const factor = decayFactor(d, refDate, halfLife)

    const dateKey = d.toISOString().slice(0, 10)
    const existing = byDate.get(dateKey) ?? { count: 0, totalDecay: 0 }
    byDate.set(dateKey, {
      count: existing.count + 1,
      totalDecay: existing.totalDecay + factor,
    })
  }

  let persistenceScore = 0
  const timeDecayedCounts: TimeDecayedCount[] = []

  for (const [date, { count, totalDecay }] of byDate.entries()) {
    persistenceScore += totalDecay
    timeDecayedCounts.push({
      date,
      count,
      decayedContribution: totalDecay,
    })
  }

  timeDecayedCounts.sort((a, b) => a.date.localeCompare(b.date))

  return {
    persistenceScore: Math.round(persistenceScore * 100) / 100,
    timeDecayedCounts,
  }
}
