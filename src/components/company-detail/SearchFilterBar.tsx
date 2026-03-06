import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIME_WINDOWS } from '@/types/dashboard'

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

export interface SearchFilterBarFilters {
  source?: string
  role?: string
  timeWindow?: string
}

export interface SearchFilterBarProps {
  query: string
  filters: SearchFilterBarFilters
  onQueryChange: (query: string) => void
  onFiltersChange: (filters: SearchFilterBarFilters) => void
  debounceMs?: number
  showTimeFilter?: boolean
  className?: string
}

export function SearchFilterBar({
  query,
  filters,
  onQueryChange,
  onFiltersChange,
  debounceMs = 300,
  showTimeFilter = true,
  className,
}: SearchFilterBarProps) {
  const [localQuery, setLocalQuery] = useState(query)

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    const t = setTimeout(() => {
      onQueryChange(localQuery)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [localQuery, debounceMs, onQueryChange])

  const handleFilterChange = useCallback(
    (key: keyof SearchFilterBarFilters, value: string) => {
      onFiltersChange({ ...filters, [key]: value })
    },
    [filters, onFiltersChange]
  )

  return (
    <div
      className={cn('flex flex-wrap items-end gap-4', className)}
      role="search"
      aria-label="Search and filter narratives"
    >
      <div className="relative flex-1 min-w-[200px]">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search companies, narratives, events..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-9 rounded-lg"
          aria-label="Search"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {showTimeFilter && (
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-time" className="text-sm text-muted-foreground whitespace-nowrap">
              Time
            </Label>
            <Select
              value={filters.timeWindow ?? '30d'}
              onValueChange={(v) => handleFilterChange('timeWindow', v)}
            >
              <SelectTrigger id="filter-time" className="w-[120px]">
                <SelectValue placeholder="Window" />
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
        )}
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-source" className="text-sm text-muted-foreground whitespace-nowrap">
            Source
          </Label>
          <Select
            value={filters.source ?? 'all'}
            onValueChange={(v) => handleFilterChange('source', v)}
          >
            <SelectTrigger id="filter-source" className="w-[120px]">
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
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-role" className="text-sm text-muted-foreground whitespace-nowrap">
            Speaker role
          </Label>
          <Select
            value={filters.role ?? 'all'}
            onValueChange={(v) => handleFilterChange('role', v)}
          >
            <SelectTrigger id="filter-role" className="w-[120px]">
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
      </div>
    </div>
  )
}
