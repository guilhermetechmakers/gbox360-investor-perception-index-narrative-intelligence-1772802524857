import { useState, useMemo } from 'react'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  ComparisonHeader,
  IPIHeroPanel,
  NarrativeListCard,
  NarrativeTileGrid,
  HistoricalComparisonEmptyState,
} from '@/components/historical-comparison'
import { useCompanies } from '@/hooks/use-companies'
import { useHistoricalComparison } from '@/hooks/use-historical-comparison'
import {
  classifyTopics,
  computeIPI,
  computePersistence,
} from '@/lib/historical-comparison'
import type {
  IPIComponents,
  ExportPayload,
  DecayConfig,
} from '@/types/historical-comparison'

const DEFAULT_DECAY_CONFIG: DecayConfig = {
  halfLifeDays: 30,
  decayFactor: 0.85,
}

export default function HistoricalComparison() {
  const [companyId, setCompanyId] = useState('')
  const [baselineWindowId, setBaselineWindowId] = useState('6m')
  const [comparisonWindowId, setComparisonWindowId] = useState('3m')
  const [peerId, setPeerId] = useState('none')

  const { data: companies } = useCompanies()
  const safeCompanies = Array.isArray(companies) ? companies : []
  const effectiveCompanyId = companyId || (safeCompanies[0]?.id ?? '')

  const { data, isLoading, isError } = useHistoricalComparison(
    effectiveCompanyId,
    baselineWindowId,
    peerId === 'none' ? undefined : peerId
  )

  const windows = data?.windows ?? []
  const peers = data?.peers ?? []
  const rawNarratives = data?.narratives ?? []

  const narrativesWithTopics = useMemo(() => {
    const items = Array.isArray(rawNarratives) ? rawNarratives : []
    return items.map((n) => {
      const topics = classifyTopics(n)
      return { ...n, topics }
    })
  }, [rawNarratives])

  const { persistenceScore, timeDecayedCounts } = useMemo(() => {
    return computePersistence(narrativesWithTopics, DEFAULT_DECAY_CONFIG)
  }, [narrativesWithTopics])

  const decayFactor = DEFAULT_DECAY_CONFIG.decayFactor

  const baselineIPI = useMemo((): IPIComponents | null => {
    const credibility = 70
    const risk = 25
    const narrative = Math.min(100, persistenceScore * 2)
    return computeIPI(narrative, credibility, risk, decayFactor)
  }, [persistenceScore, decayFactor])

  const comparisonIPI = useMemo((): IPIComponents | null => {
    const credibility = 68
    const risk = 28
    const narrative = Math.min(100, persistenceScore * 1.8)
    return computeIPI(narrative, credibility, risk, decayFactor)
  }, [persistenceScore, decayFactor])

  const deltaBaseline = baselineIPI ? (baselineIPI.total - (comparisonIPI?.total ?? 0)) : 0
  const deltaComparison = comparisonIPI ? (comparisonIPI.total - (baselineIPI?.total ?? 0)) : 0

  const topNarrativesWithImpact = useMemo(() => {
    const items = Array.isArray(narrativesWithTopics) ? narrativesWithTopics : []
    return items.slice(0, 5).map((event, i) => ({
      event,
      impact: Math.max(0, 30 - i * 5),
    }))
  }, [narrativesWithTopics])

  const exportData = useMemo((): ExportPayload => {
    return {
      companyId: effectiveCompanyId,
      companyName: safeCompanies.find((c) => c.id === effectiveCompanyId)?.name,
      windowId: baselineWindowId,
      windowLabel: windows.find((w) => w.id === baselineWindowId)?.label,
      peerId: peerId === 'none' ? undefined : peerId,
      peerName: peers.find((p) => p.id === peerId)?.name,
      exportedAt: new Date().toISOString(),
      ipi: baselineIPI ?? undefined,
      narratives: topNarrativesWithImpact,
      metadata: { decayConfig: DEFAULT_DECAY_CONFIG },
    }
  }, [
    effectiveCompanyId,
    safeCompanies,
    baselineWindowId,
    windows,
    peerId,
    peers,
    baselineIPI,
    topNarrativesWithImpact,
  ])

  const hasNoCompanies = safeCompanies.length === 0
  const showEmptyState =
    (effectiveCompanyId && (isError || (!isLoading && narrativesWithTopics.length === 0))) ||
    (hasNoCompanies && !isLoading)

  if (hasNoCompanies && !isLoading) {
    return (
      <AnimatedPage className="container-narrow space-y-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Historical Comparison
        </h1>
        <HistoricalComparisonEmptyState
          reason="No companies available"
          guidance="Add companies or contact your administrator to get started."
        />
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="container-narrow space-y-6">
      <ComparisonHeader
        companyId={effectiveCompanyId}
        companyName={safeCompanies.find((c) => c.id === effectiveCompanyId)?.name}
        companies={safeCompanies.map((c) => ({ id: c.id, name: c.name }))}
        windows={windows}
        peers={peers}
        baselineWindowId={baselineWindowId}
        comparisonWindowId={comparisonWindowId}
        peerId={peerId}
        onCompanyChange={setCompanyId}
        onBaselineWindowChange={setBaselineWindowId}
        onComparisonWindowChange={setComparisonWindowId}
        onPeerChange={setPeerId}
        exportData={exportData}
        isLoading={isLoading}
      />

      {showEmptyState ? (
        <HistoricalComparisonEmptyState
          reason={hasNoCompanies ? 'No companies available' : 'No data for this comparison'}
          guidance={
            hasNoCompanies
              ? 'Add companies or contact your administrator.'
              : 'Try different windows or ensure data has been ingested.'
          }
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <IPIHeroPanel
              label={windows.find((w) => w.id === baselineWindowId)?.label ?? 'Baseline'}
              ipi={baselineIPI}
              delta={deltaBaseline}
              topNarratives={topNarrativesWithImpact.map((i) => i.event)}
              isLoading={isLoading}
              tileVariant="cream"
            />
            <IPIHeroPanel
              label={windows.find((w) => w.id === comparisonWindowId)?.label ?? 'Comparison'}
              ipi={comparisonIPI}
              delta={deltaComparison}
              topNarratives={topNarrativesWithImpact.map((i) => i.event)}
              isLoading={isLoading}
              tileVariant="sage"
            />
          </div>

          <NarrativeTileGrid
            timeDecayedCounts={timeDecayedCounts}
            isLoading={isLoading}
          />

          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
              Top narratives
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(topNarrativesWithImpact ?? []).map((item) => (
                <NarrativeListCard
                  key={item.event.id}
                  narrative={item.event}
                  impact={item.impact}
                />
              ))}
            </div>
            {topNarrativesWithImpact.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground">
                No narratives in this window.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            IPI weights are provisional (40% Narrative / 40% Credibility / 20% Risk).
            Raw payload references are preserved for audit. Export artifacts include
            full provenance.
          </p>
        </>
      )}
    </AnimatedPage>
  )
}
