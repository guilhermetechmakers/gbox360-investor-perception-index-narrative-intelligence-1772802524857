import { describe, it, expect } from 'vitest'
import {
  detectTopicsRuleBased,
  classifyTopics,
} from './topicClassifier'

describe('topicClassifier', () => {
  describe('detectTopicsRuleBased', () => {
    it('returns [] for null/undefined', () => {
      expect(detectTopicsRuleBased(null)).toEqual([])
      expect(detectTopicsRuleBased(undefined)).toEqual([])
    })

    it('returns [] for empty string', () => {
      expect(detectTopicsRuleBased('')).toEqual([])
      expect(detectTopicsRuleBased('   ')).toEqual([])
    })

    it('detects earnings topic', () => {
      expect(detectTopicsRuleBased('Revenue exceeded guidance this quarter')).toContain('earnings')
    })

    it('detects governance topic', () => {
      expect(detectTopicsRuleBased('Board announced new CEO')).toContain('governance')
    })

    it('detects risk topic', () => {
      expect(detectTopicsRuleBased('Regulatory investigation ongoing')).toContain('risk')
    })

    it('returns multiple topics when applicable', () => {
      const topics = detectTopicsRuleBased(
        'Earnings beat expectations. Board approved expansion. Regulatory risk remains.'
      )
      expect(topics).toContain('earnings')
      expect(topics).toContain('governance')
      expect(topics).toContain('risk')
    })
  })

  describe('classifyTopics', () => {
    it('returns [] for null/undefined', () => {
      expect(classifyTopics(null)).toEqual([])
      expect(classifyTopics(undefined)).toEqual([])
    })
  })
})
