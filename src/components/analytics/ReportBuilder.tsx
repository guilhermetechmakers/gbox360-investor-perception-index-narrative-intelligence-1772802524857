import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FileBarChart2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const TIMEFRAME_PRESETS = [
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_90_days', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
] as const

const METRIC_OPTIONS = [
  { id: 'mau', label: 'Monthly Active Users' },
  { id: 'queriesPerUser', label: 'Queries per user' },
  { id: 'throughput', label: 'Ingestion throughput' },
  { id: 'adoption', label: 'Feature adoption' },
] as const

const EXPORT_FORMATS = ['CSV', 'PDF'] as const

export interface ReportBuilderProps {
  onExport?: (params: {
    timeframe: string
    startDate?: string
    endDate?: string
    metrics: string[]
    format: 'CSV' | 'PDF'
  }) => void | Promise<void>
  isLoading?: boolean
}

export function ReportBuilder({
  onExport,
  isLoading = false,
}: ReportBuilderProps) {
  const [timeframe, setTimeframe] = useState<string>('last_30_days')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(['mau', 'throughput'])
  )
  const [format, setFormat] = useState<'CSV' | 'PDF'>('CSV')
  const [isExporting, setIsExporting] = useState(false)

  const handleToggleMetric = (id: string, checked: boolean) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleRun = async () => {
    const metrics = Array.from(selectedMetrics)
    if (metrics.length === 0) {
      toast.error('Select at least one metric')
      return
    }

    const effectiveTimeframe =
      timeframe === 'custom' && startDate && endDate
        ? `custom:${startDate}:${endDate}`
        : timeframe

    setIsExporting(true)
    try {
      await onExport?.({
        timeframe: effectiveTimeframe,
        startDate: timeframe === 'custom' ? startDate : undefined,
        endDate: timeframe === 'custom' ? endDate : undefined,
        metrics,
        format,
      })
    } catch {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="rounded-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <FileBarChart2 className="h-5 w-5 text-muted-foreground" aria-hidden />
          Report builder
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select timeframe, metrics, and export format for ad-hoc reports.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : (
          <>
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full max-w-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAME_PRESETS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {timeframe === 'custom' && (
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="flex flex-wrap gap-4">
                {METRIC_OPTIONS.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`metric-${m.id}`}
                      checked={selectedMetrics.has(m.id)}
                      onCheckedChange={(c) =>
                        handleToggleMetric(m.id, !!c)
                      }
                      aria-label={`Include ${m.label}`}
                    />
                    <Label
                      htmlFor={`metric-${m.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {m.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Export format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as 'CSV' | 'PDF')}>
                <SelectTrigger className="w-32 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_FORMATS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleRun}
              disabled={isExporting || selectedMetrics.size === 0}
              className={cn(
                'rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]',
                'transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
              )}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden />
              {isExporting ? 'Generating…' : 'Run report'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
