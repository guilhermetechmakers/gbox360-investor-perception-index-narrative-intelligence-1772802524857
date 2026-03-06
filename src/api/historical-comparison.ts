/**
 * DataAdapter for Historical Comparison.
 * Fetches windows, peers, narratives, and IPI data.
 * Validates shapes: Array.isArray(response?.data) ? response.data : []
 */
import { api } from '@/lib/api'
import { createEvent } from '@/lib/historical-comparison'
import type {
  NarrativeEvent,
  HistoricalWindow,
  Peer,
  IPIComponents,
} from '@/types/historical-comparison'

export interface HistoricalComparisonResponse {
  windows: HistoricalWindow[]
  peers: Peer[]
  narratives: NarrativeEvent[]
  ipi: IPIComponents[]
}

/** Mock/sample narratives for MVP when API is unavailable */
function getMockNarratives(companyId: string, windowId: string): NarrativeEvent[] {
  const base = [
    createEvent({
      sourcePlatform: 'News API',
      speaker: { name: 'Reuters', role: 'Media' },
      audienceClass: 'institutional',
      rawText: 'Company reports strong Q3 earnings, beating analyst expectations on revenue growth.',
      timestamps: {
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        eventAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      payloadReference: `payload_${companyId}_${windowId}_1`,
    }),
    createEvent({
      sourcePlatform: 'Earnings Transcript',
      speaker: { name: 'CFO', role: 'Management' },
      audienceClass: 'institutional',
      rawText: 'We remain confident in our full-year guidance and see continued momentum in core segments.',
      timestamps: {
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        eventAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      payloadReference: `payload_${companyId}_${windowId}_2`,
    }),
    createEvent({
      sourcePlatform: 'Social',
      speaker: { name: 'Analyst', role: 'Analyst' },
      audienceClass: 'retail',
      rawText: 'Governance concerns raised following recent board changes. ESG score under review.',
      timestamps: {
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        eventAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
      payloadReference: `payload_${companyId}_${windowId}_3`,
    }),
  ]
  return base
}

/** Default windows for MVP */
const DEFAULT_WINDOWS: HistoricalWindow[] = [
  { id: '6m', label: 'Last 6 months', dateRange: '6 months' },
  { id: '3m', label: 'Last 3 months', dateRange: '3 months' },
  { id: '1m', label: 'Last month', dateRange: '1 month' },
  { id: 'prior_q', label: 'Prior quarter', dateRange: 'Prior quarter' },
]

/** Default peers for MVP placeholder */
const DEFAULT_PEERS: Peer[] = [
  { id: 'none', name: 'No peer', description: 'Compare without peer' },
  { id: 'peer_a', name: 'Peer A', description: 'Industry peer' },
  { id: 'peer_b', name: 'Peer B', description: 'Industry peer' },
]

export const historicalComparisonApi = {
  /**
   * GET /api/historical-comparison?companyId=&windowId=&peerId=
   */
  getData: async (
    companyId: string,
    windowId?: string,
    peerId?: string
  ): Promise<HistoricalComparisonResponse> => {
    try {
      const params: Record<string, string> = { companyId }
      if (windowId) params.windowId = windowId
      if (peerId) params.peerId = peerId
      const res = await api.get<HistoricalComparisonResponse>(
        '/historical-comparison',
        params
      )
      const windows = Array.isArray(res?.windows) ? res.windows : DEFAULT_WINDOWS
      const peers = Array.isArray(res?.peers) ? res.peers : DEFAULT_PEERS
      const narratives = Array.isArray(res?.narratives) ? res.narratives : []
      const ipi = Array.isArray(res?.ipi) ? res.ipi : []
      return { windows, peers, narratives, ipi }
    } catch {
      const winId = windowId ?? '6m'
      const narratives = getMockNarratives(companyId, winId)
      return {
        windows: DEFAULT_WINDOWS,
        peers: DEFAULT_PEERS,
        narratives,
        ipi: [],
      }
    }
  },

  /**
   * POST /api/historical-comparison/export
   */
  exportArtifacts: async (
    payload: Record<string, unknown>
  ): Promise<{ csv?: string; pdf?: string; json?: string }> => {
    try {
      return api.post<{ csv?: string; pdf?: string; json?: string }>(
        '/historical-comparison/export',
        payload
      )
    } catch {
      return {}
    }
  },
}
