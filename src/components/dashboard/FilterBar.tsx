import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { TIME_WINDOWS } from '@/types/dashboard'
import { cn } from '@/lib/utils'

const SOURCES = [
  { value: 'all', label: 'All sources' },
  { value: 'news', label: 'News' },
  { value: 'social', label: 'Social' },
  { value: 'transcript', label: 'Transcript' },
]

const ROLES = [
  { value: 'all', label: 'All roles' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'media', label: 'Media' },
  { value: 'retail', label: 'Retail' },
]

export interface FilterBarProps {
  timeWindow: string
  setTimeWindow: (key: string) => void
  selectedSource?: string
  setSelectedSource?: (value: string) => void
  selectedRole?: string
  setSelectedRole?: (value: string) => void
  className?: string
}

export function FilterBar({
  timeWindow,
  setTimeWindow,
  selectedSource = 'all',
  setSelectedSource,
  selectedRole = 'all',
  setSelectedRole,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-4', className)}
      role="group"
      aria-label="Filters"
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="time-window" className="text-sm text-muted-foreground">
          Time window
        </Label>
        <Select value={timeWindow} onValueChange={setTimeWindow}>
          <SelectTrigger id="time-window" className="w-[140px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {TIME_WINDOWS.map((w) => (
              <SelectItem key={w.key} value={w.key}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {setSelectedSource && (
        <div className="flex items-center gap-2">
          <Label htmlFor="source-filter" className="text-sm text-muted-foreground">
            Source
          </Label>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger id="source-filter" className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {setSelectedRole && (
        <div className="flex items-center gap-2">
          <Label htmlFor="role-filter" className="text-sm text-muted-foreground">
            Speaker role
          </Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role-filter" className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
