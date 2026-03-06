/**
 * Simplified IPI Engine for Gbox360.
 * Provisional weights: Narrative 40%, Credibility 40%, Risk 20%.
 * Decay factor applied to Narrative component.
 * Safeguards: clamp to [0,100]; treat NaN/undefined as 0.
 */
import type { IPIComponents } from '@/types/historical-comparison'

const NARRATIVE_WEIGHT = 0.4
const CREDIBILITY_WEIGHT = 0.4
const RISK_WEIGHT = 0.2

function safeNumber(v: unknown): number {
  if (v == null) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Compute IPI from component scores.
 * Narrative component = 0.4 * narrativeScore * decayFactor
 * Credibility component = 0.4 * credibilityScore
 * Risk proxy component = 0.2 * riskProxyScore
 * Total = sum of components, clamped to [0, 100]
 */
export function computeIPI(
  narrativeScore: number,
  credibilityScore: number,
  riskProxyScore: number,
  decayFactor: number = 1
): IPIComponents {
  const n = clamp(safeNumber(narrativeScore), 0, 100)
  const c = clamp(safeNumber(credibilityScore), 0, 100)
  const r = clamp(safeNumber(riskProxyScore), 0, 100)
  const d = clamp(safeNumber(decayFactor), 0, 1)

  const narrativeComponent = NARRATIVE_WEIGHT * n * (d > 0 ? d : 1)
  const credibilityComponent = CREDIBILITY_WEIGHT * c
  const riskComponent = RISK_WEIGHT * r

  const total = clamp(
    narrativeComponent + credibilityComponent + riskComponent,
    0,
    100
  )

  return {
    narrative: Math.round(narrativeComponent * 100) / 100,
    credibility: Math.round(credibilityComponent * 100) / 100,
    risk: Math.round(riskComponent * 100) / 100,
    total: Math.round(total * 100) / 100,
    decayFactor: d,
  }
}

/** Weights are provisional; used for UI tooltips */
export const PROVISIONAL_WEIGHTS = {
  narrative: NARRATIVE_WEIGHT,
  credibility: CREDIBILITY_WEIGHT,
  risk: RISK_WEIGHT,
} as const
