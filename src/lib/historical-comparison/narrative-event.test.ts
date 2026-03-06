import { describe, it, expect } from 'vitest'
import { createEvent, validateEvent, serializeForAudit } from './narrativeEventModel'
import type { NarrativeEvent } from '@/types/historical-comparison'

describe('narrativeEventModel', () => {
  describe('createEvent', () => {
    it('creates immutable event with required fields', () => {
      const ev = createEvent({
        id: 'ev-1',
        sourcePlatform: 'News',
        speaker: { name: 'Analyst', role: 'analyst' },
        audienceClass: 'institutional',
        rawText: 'Sample text',
        timestamps: { createdAt: '2025-01-01T00:00:00Z' },
        payloadReference: '/raw/p1',
      })
      expect(ev.id).toBe('ev-1')
      expect(ev.sourcePlatform).toBe('News')
      expect(ev.speaker.name).toBe('Analyst')
      expect(ev.speaker.role).toBe('analyst')
      expect(ev.audienceClass).toBe('institutional')
      expect(ev.rawText).toBe('Sample text')
      expect(ev.timestamps.createdAt).toBe('2025-01-01T00:00:00Z')
      expect(ev.payloadReference).toBe('/raw/p1')
    })

    it('uses defaults for missing optional fields', () => {
      const ev = createEvent({
        id: 'ev-2',
        sourcePlatform: 'Social',
      })
      expect(ev.speaker.name).toBe('Unknown')
      expect(ev.audienceClass).toBe('general')
      expect(ev.rawText).toBe('')
      expect(ev.payloadReference).toBe('')
      expect(ev.timestamps.createdAt).toBeDefined()
    })
  })

  describe('validateEvent', () => {
    it('returns true for valid event', () => {
      const ev: NarrativeEvent = {
        id: 'x',
        sourcePlatform: 'x',
        speaker: { name: 'x' },
        audienceClass: 'x',
        rawText: 'x',
        timestamps: { createdAt: '2025-01-01' },
        payloadReference: 'x',
      }
      expect(validateEvent(ev)).toBe(true)
    })

    it('returns false for null/undefined', () => {
      expect(validateEvent(null)).toBe(false)
      expect(validateEvent(undefined)).toBe(false)
    })

    it('returns false for invalid shapes', () => {
      expect(validateEvent({})).toBe(false)
      expect(validateEvent({ id: '' })).toBe(false)
      expect(validateEvent({ id: 'x', sourcePlatform: 'x' })).toBe(false)
    })
  })

  describe('serializeForAudit', () => {
    it('returns plain object safe for JSON', () => {
      const ev: NarrativeEvent = {
        id: 'ev-1',
        sourcePlatform: 'News',
        speaker: { name: 'A', role: 'analyst' },
        audienceClass: 'inst',
        rawText: 'text',
        timestamps: { createdAt: '2025-01-01', eventAt: '2025-01-02' },
        payloadReference: '/p1',
        topics: ['earnings'],
      }
      const out = serializeForAudit(ev)
      expect(out).toEqual({
        id: 'ev-1',
        sourcePlatform: 'News',
        speaker: { name: 'A', role: 'analyst' },
        audienceClass: 'inst',
        rawText: 'text',
        timestamps: { createdAt: '2025-01-01', eventAt: '2025-01-02' },
        payloadReference: '/p1',
        topics: ['earnings'],
      })
    })

    it('does not mutate original event', () => {
      const ev: NarrativeEvent = {
        id: 'x',
        sourcePlatform: 'x',
        speaker: { name: 'x' },
        audienceClass: 'x',
        rawText: 'x',
        timestamps: { createdAt: 'x' },
        payloadReference: 'x',
      }
      const out = serializeForAudit(ev)
      ;(out as Record<string, unknown>).id = 'mutated'
      expect(ev.id).toBe('x')
    })
  })
})
