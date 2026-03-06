import { describe, it, expect } from 'vitest'
import { computePersistence } from './narrativePersistenceEngine'
import type { NarrativeEvent } from '@/types/historical-comparison'

const mockEvent = (id: string, date: string): NarrativeEvent => ({
  id,
  sourcePlatform: 'News',
  speaker: { name: 'A' },
  audienceClass: 'gen',
  rawText: 'text',
  timestamps: { createdAt: date, eventAt: date },
  payloadReference: '',
})

describe('narrativePersistenceEngine', () => {
  it('returns empty when narratives is null/undefined', () => {
    const r1 = computePersistence(null, { halfLifeDays: 30, decayFactor: 0.85 })
    const r2 = computePersistence(undefined, { halfLifeDays: 30, decayFactor: 0.85 })
    expect(r1.persistenceScore).toBe(0)
    expect(r1.timeDecayedCounts).toEqual([])
    expect(r2.persistenceScore).toBe(0)
  })

  it('returns empty when narratives is empty array', () => {
    const r = computePersistence([], { halfLifeDays: 30, decayFactor: 0.85 })
    expect(r.persistenceScore).toBe(0)
    expect(r.timeDecayedCounts).toEqual([])
  })

  it('computes persistence from valid narratives', () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
    const events = [
      mockEvent('1', weekAgo),
      mockEvent('2', weekAgo),
      mockEvent('3', twoWeeksAgo),
    ]
    const r = computePersistence(events, { halfLifeDays: 30, decayFactor: 0.85 })
    expect(r.persistenceScore).toBeGreaterThan(0)
    expect(r.timeDecayedCounts.length).toBeGreaterThan(0)
  })

  it('skips events with missing or invalid dates', () => {
    const events: NarrativeEvent[] = [
      {
        ...mockEvent('1', '2025-02-01'),
        timestamps: { createdAt: '', eventAt: undefined },
      },
    ]
    const r = computePersistence(events, { halfLifeDays: 30, decayFactor: 0.85 })
    expect(r.timeDecayedCounts).toEqual([])
  })
})
