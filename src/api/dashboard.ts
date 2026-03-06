import { api } from '@/lib/api'
import { ipiApi } from '@/api/ipi'
import { narrativesApi } from '@/api/narratives'
import type {
  DashboardResponse,
  NarrativeContribution,
  NarrativeEventSummary,
  IPIResult,
} from '@/types/dashboard'
import type { Narrative } from '@/types/narrative'
import type { NarrativeEvent } from '@/types/narrative'
import type { IPISnapshot } from '@/types/ipi'
import { subDays, format } from 'date-fns'

/**
 * Maps Narrative to NarrativeContribution for dashboard display.
 */
function mapNarrativeToContribution(n: Narrative): NarrativeContribution {
  const sources = Array.isArray(n.events)
    ? [...new Set((n.events ?? []).map((e) => e?.source ?? 'unknown').filter(Boolean))]
    : []
  return {
    narrativeId: n.id,
    title: n.summary ?? '—',
    contribution: n.contributionPercent ?? 0,
    sources,
    topic: n.topic,
  }
}

/**
 * Maps NarrativeEvent to NarrativeEventSummary for recent activity feed.
 */
function mapEventToSummary(e: NarrativeEvent): NarrativeEventSummary {
  return {
    id: e.eventId ?? '',
    source: e.source ?? 'unknown',
    speakerRole: e.speakerRole,
    timestamp: e.publishedAt ?? e.ingestedAt,
    text: e.rawText,
    rawText: e.rawText,
  }
}

export const dashboardApi = {
  /**
   * GET /api/dashboard?companyId=&timeWindow=
   * Returns IPI snapshot, top narratives, and recent events.
   * Falls back to aggregating from existing APIs when dashboard endpoint is unavailable.
   */
  getDashboard: async (
    companyId: string,
    timeWindowKey: string
  ): Promise<DashboardResponse> => {
    const { start, end } = getDateRangeForWindow(timeWindowKey)
    const startStr = format(start, 'yyyy-MM-dd')
    const endStr = format(end, 'yyyy-MM-dd')

    try {
      const res = await api.get<DashboardResponse>(
        `/dashboard?companyId=${encodeURIComponent(companyId)}&timeWindow=${encodeURIComponent(timeWindowKey)}`
      )
      const ipi = res?.ipi ?? null
      const topNarratives = Array.isArray(res?.topNarratives)
        ? res.topNarratives
        : null
      const recentEvents = Array.isArray(res?.recentEvents)
        ? res.recentEvents
        : null
      return { ipi, topNarratives, recentEvents, status: res?.status }
    } catch {
      return buildDashboardFromExistingApis(companyId, startStr, endStr)
    }
  },

  /**
   * POST /api/export - Export current view to CSV/PDF.
   */
  exportView: async (
    format: 'csv' | 'pdf',
    data: unknown[],
    metadata?: Record<string, unknown>
  ): Promise<{ url?: string; success?: boolean }> => {
    try {
      return api.post<{ url?: string; success?: boolean }>('/export', {
        format,
        data: data ?? [],
        metadata,
      })
    } catch {
      return { success: false }
    }
  },
}

function getDateRangeForWindow(
  key: string
): { start: Date; end: Date } {
  const end = new Date()
  let start: Date
  if (key === '7d') start = subDays(end, 7)
  else if (key === 'ytd') start = new Date(end.getFullYear(), 0, 1)
  else start = subDays(end, 30)
  return { start, end }
}

async function buildDashboardFromExistingApis(
  companyId: string,
  startStr: string,
  endStr: string
): Promise<DashboardResponse> {
  let snapshot: IPISnapshot | null = null
  let narratives: Narrative[] = []

  try {
    const [snap, nars] = await Promise.all([
      ipiApi.getSnapshot(companyId, startStr, endStr),
      narrativesApi.getTopByCompany(companyId, 3, startStr, endStr),
    ])
    snapshot = snap
    narratives = Array.isArray(nars) ? nars : []
  } catch {
    narratives = []
  }

  const topNarratives: NarrativeContribution[] = (narratives as Narrative[])
    .slice(0, 3)
    .map(mapNarrativeToContribution)

  const recentEvents: NarrativeEventSummary[] = []
  for (const n of narratives as Narrative[]) {
    const events = n?.events ?? []
    for (const e of events) {
      if (e) recentEvents.push(mapEventToSummary(e))
    }
  }
  recentEvents.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return tb - ta
  })

  const ipi: IPIResult | null = snapshot
    ? {
        score: snapshot.score ?? 0,
        delta: snapshot.delta ?? 0,
        lastUpdated: snapshot.computedAt ?? new Date().toISOString(),
        breakdown: snapshot.breakdown,
      }
    : null

  return {
    ipi,
    topNarratives,
    recentEvents: recentEvents.slice(0, 10),
  }
}
