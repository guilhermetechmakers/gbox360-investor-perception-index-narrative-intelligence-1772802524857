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

export interface ExportAuditButtonProps {
  dataset: unknown[]
  metadata?: Record<string, unknown>
  companyName?: string
  timeWindow?: string
  className?: string
}

export function ExportAuditButton({
  dataset,
  metadata = {},
  companyName,
  timeWindow,
  className,
}: ExportAuditButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const items = Array.isArray(dataset) ? dataset : []

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (items.length === 0) {
      toast.info('No data to export')
      return
    }
    setIsExporting(true)
    try {
      const meta = {
        ...metadata,
        companyName: companyName ?? undefined,
        timeWindow: timeWindow ?? undefined,
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
