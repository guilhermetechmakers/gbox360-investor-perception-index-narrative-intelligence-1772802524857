import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileSpreadsheet, FileJson, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { exportCSV, exportJSON, exportPDF } from '@/lib/historical-comparison'
import type { ExportPayload } from '@/types/historical-comparison'
import { cn } from '@/lib/utils'

export interface ExportButtonProps {
  data: ExportPayload | null | undefined
  disabled?: boolean
  className?: string
}

export function ExportButton({
  data,
  disabled = false,
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true)
    try {
      if (format === 'csv') exportCSV(data)
      else if (format === 'json') exportJSON(data)
      else exportPDF(data)
      toast.success(`Export as ${format.toUpperCase()} completed`)
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
          disabled={disabled || isExporting}
          aria-label="Export audit artifacts"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={isExporting}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('json')}
          disabled={isExporting}
        >
          <FileJson className="mr-2 h-4 w-4" />
          JSON
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF (Print)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
