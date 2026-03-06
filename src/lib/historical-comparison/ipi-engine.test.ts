import { describe, it, expect } from 'vitest'
import { computeIPI } from './ipiEngine'

describe('ipi-engine', () => {
  it('computes IPI with provisional weights', () => {
    const r = computeIPI(60, 70, 40)
    expect(r.narrative).toBeCloseTo(24, 1)
    expect(r.credibility).toBeCloseTo(28, 1)
    expect(r.risk).toBeCloseTo(8, 1)
    expect(r.total).toBeCloseTo(60, 0)
  })

  it('applies decay factor to narrative component', () => {
    const full = computeIPI(100, 0, 0, 1)
    const half = computeIPI(100, 0, 0, 0.5)
    expect(full.narrative).toBe(40)
    expect(half.narrative).toBe(20)
  })

  it('treats NaN/undefined as 0', () => {
    const r1 = computeIPI(NaN, 50, 50)
    expect(r1.narrative).toBe(0)
    const r2 = computeIPI(0, 0, 0)
    expect(r2.total).toBe(0)
  })

  it('clamps values to [0, 100]', () => {
    const r = computeIPI(150, -10, 200)
    expect(r.narrative).toBeLessThanOrEqual(40)
    expect(r.credibility).toBe(0)
    expect(r.risk).toBeLessThanOrEqual(20)
  })
})
