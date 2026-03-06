import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { dashboardApi } from '@/api/dashboard'
import { cn } from '@/lib/utils'

export interface AuditExportPayloadData {
  breakdown: { narrative: number; credibility: number; risk: number }
  narratives: unknown[]
  events: unknown[]
}

export interface AuditExportButtonProps {
  payloadData: AuditExportPayloadData
  companyId?: string
  companyName?: string
  windowStart?: string
  windowEnd?: string
  timeWindow?: string
  className?: string
}

export function AuditExportButton({
  payloadData,
  companyId,
  companyName,
  windowStart,
  windowEnd,
  timeWindow,
  className,
}: AuditExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const items: unknown[] = [
    { type: 'breakdown', ...payloadData.breakdown },
    ...(payloadData.narratives ?? []).map((n) => ({ type: 'narrative', ...(typeof n === 'object' && n !== null ? (n as Record<string, unknown>) : {}) })),
    ...(payloadData.events ?? []).map((e) => ({ type: 'event', ...(typeof e === 'object' && e !== null ? (e as Record<string, unknown>) : {}) })),
  ]

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (items.length === 0) {
      toast.info('No data to export')
      return
    }
    setIsExporting(true)
    try {
      const meta = {
        companyName: companyName ?? undefined,
        timeWindow: timeWindow ?? undefined,
        windowStart: windowStart ?? undefined,
        windowEnd: windowEnd ?? undefined,
        exportedAt: new Date().toISOString(),
      }
      const res = await dashboardApi.exportView(format, items, meta)
      if (res?.url) {
        window.open(res.url, '_blank')
        toast.success(`Export started. ${format.toUpperCase()} will download shortly.`)
      } else if (res?.success) {
        toast.success('Export completed.')
      } else {
        toast.info('Export requested. Check your downloads or try again.')
      }
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJson = () => {
    const artifact = {
      exportedAt: new Date().toISOString(),
      companyId: companyId ?? undefined,
      companyName: companyName ?? undefined,
      windowStart: windowStart ?? undefined,
      windowEnd: windowEnd ?? undefined,
      weights: { narrative: 40, credibility: 40, risk: 20 },
      breakdown: payloadData.breakdown,
      narratives: payloadData.narratives ?? [],
      events: payloadData.events ?? [],
    }
    const blob = new Blob([JSON.stringify(artifact, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-artifact-${companyId ?? 'export'}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit artifact downloaded.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('rounded-full', className)}
          disabled={isExporting}
          aria-label="Export or audit current view"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export / Audit
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJson} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export audit artifact (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={isExporting}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
