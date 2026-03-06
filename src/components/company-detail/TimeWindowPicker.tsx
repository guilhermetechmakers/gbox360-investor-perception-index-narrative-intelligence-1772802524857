import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { format, subDays } from 'date-fns'

export interface WindowRange {
  start: string
  end: string
}

export interface TimeWindowPickerProps {
  currentWindow: string
  onChange: (key: string, range: WindowRange) => void
  compareEnabled?: boolean
  onCompareToggle?: (enabled: boolean) => void
  className?: string
}

const PRESETS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: 'ytd', label: 'YTD' },
]

export function getDateRangeForWindow(key: string): WindowRange {
  const end = new Date()
  let start: Date
  if (key === '7d') start = subDays(end, 7)
  else if (key === 'ytd') start = new Date(end.getFullYear(), 0, 1)
  else start = subDays(end, 30)
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  }
}

export function TimeWindowPicker({
  currentWindow,
  onChange,
  compareEnabled = false,
  onCompareToggle,
  className,
}: TimeWindowPickerProps) {
  const [internalWindow, setInternalWindow] = useState(currentWindow)

  const handleChange = (key: string) => {
    setInternalWindow(key)
    const range = getDateRangeForWindow(key)
    onChange(key, range)
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)} role="group" aria-label="Time window selection">
      <div className="flex items-center gap-2">
        <Label htmlFor="time-window-picker" className="text-sm text-muted-foreground">
          Time window
        </Label>
        <Select value={internalWindow} onValueChange={handleChange}>
          <SelectTrigger id="time-window-picker" className="w-[160px]" aria-label="Select time window">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((p) => (
              <SelectItem key={p.key} value={p.key}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {onCompareToggle && (
        <div className="flex items-center gap-2">
          <Switch
            id="compare-toggle"
            checked={compareEnabled}
            onCheckedChange={onCompareToggle}
            aria-label="Compare with prior window"
          />
          <Label htmlFor="compare-toggle" className="text-sm text-muted-foreground">
            Compare with prior
          </Label>
        </div>
      )}
    </div>
  )
}
