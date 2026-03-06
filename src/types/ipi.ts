export interface IPIBreakdown {
  narrative: number
  credibility: number
  risk: number
}

export interface IPIWeights {
  narrative: number
  credibility: number
  risk: number
}

export interface IPISnapshot {
  companyId: string
  score: number
  delta: number
  breakdown: IPIBreakdown
  weights: IPIWeights
  computedAt: string
}

export interface IPITimeSeriesPoint {
  date: string
  score: number
  narrative: number
  credibility: number
  risk: number
}
