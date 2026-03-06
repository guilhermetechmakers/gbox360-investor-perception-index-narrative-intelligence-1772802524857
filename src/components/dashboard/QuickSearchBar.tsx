import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuickSearchBarProps {
  searchQuery: string
  onSearch: (query: string) => void
  onFilterChange?: (filters: { source?: string; role?: string }) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function QuickSearchBar({
  searchQuery,
  onSearch,
  placeholder = 'Search companies, narratives, events...',
  debounceMs = 300,
  className,
}: QuickSearchBarProps) {
  const [localValue, setLocalValue] = useState(searchQuery)

  useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(localValue)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [localValue, debounceMs, onSearch])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
    },
    []
  )

  return (
    <div className={cn('relative flex-1 md:min-w-[240px]', className)}>
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="pl-9 rounded-lg"
        aria-label="Search companies, narratives, and events"
      />
    </div>
  )
}
