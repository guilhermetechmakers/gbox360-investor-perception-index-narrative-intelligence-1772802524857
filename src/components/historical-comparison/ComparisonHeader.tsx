import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExportButton } from './ExportButton'
import { ProvisionalWeightBadge } from './ProvisionalWeightBadge'
import type { HistoricalWindow, Peer } from '@/types/historical-comparison'
import type { ExportPayload } from '@/types/historical-comparison'
import { cn } from '@/lib/utils'

export interface ComparisonHeaderProps {
  companyId: string
  companyName?: string
  companies: Array<{ id: string; name: string }>
  windows: HistoricalWindow[]
  peers: Peer[]
  baselineWindowId: string
  comparisonWindowId: string
  peerId: string
  onCompanyChange: (id: string) => void
  onBaselineWindowChange: (id: string) => void
  onComparisonWindowChange: (id: string) => void
  onPeerChange: (id: string) => void
  exportData: ExportPayload | null | undefined
  isLoading?: boolean
  className?: string
}

export function ComparisonHeader({
  companyId,
  companies,
  windows,
  peers,
  baselineWindowId,
  comparisonWindowId,
  peerId,
  onCompanyChange,
  onBaselineWindowChange,
  onComparisonWindowChange,
  onPeerChange,
  exportData,
  isLoading = false,
  className,
}: ComparisonHeaderProps) {
  const safeCompanies = Array.isArray(companies) ? companies : []
  const safeWindows = Array.isArray(windows) ? windows : []
  const safePeers = Array.isArray(peers) ? peers : []

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-card border border-border/50 bg-card p-4 shadow-card md:flex-row md:flex-wrap md:items-center md:justify-between',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Historical Comparison
        </h1>
        <ProvisionalWeightBadge />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={companyId}
          onValueChange={onCompanyChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]" aria-label="Select company">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            {safeCompanies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={baselineWindowId}
          onValueChange={onBaselineWindowChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[160px]" aria-label="Baseline window">
            <SelectValue placeholder="Baseline" />
          </SelectTrigger>
          <SelectContent>
            {safeWindows.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={comparisonWindowId}
          onValueChange={onComparisonWindowChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[160px]" aria-label="Comparison window">
            <SelectValue placeholder="Compare" />
          </SelectTrigger>
          <SelectContent>
            {safeWindows.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={peerId} onValueChange={onPeerChange} disabled={isLoading}>
          <SelectTrigger className="w-[140px]" aria-label="Peer benchmark">
            <SelectValue placeholder="Peer" />
          </SelectTrigger>
          <SelectContent>
            {safePeers.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ExportButton data={exportData} disabled={isLoading} />
      </div>
    </div>
  )
}
