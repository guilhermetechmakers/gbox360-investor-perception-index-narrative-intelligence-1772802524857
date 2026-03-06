import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BarChart3, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  reason?: string
  guidance?: string
  ingestionStatus?: 'idle' | 'running' | 'complete' | 'error'
  className?: string
}

export function EmptyState({
  reason = 'No data available',
  guidance = 'Select a company and time window to view IPI and narratives. If data was recently ingested, it may take a moment to appear.',
  ingestionStatus,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 rounded-card border border-border bg-muted/20 py-16 px-6 text-center',
        className
      )}
      role="status"
      aria-label="Empty state"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-cardPastel-cream"
        aria-hidden
      >
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {reason}
        </h3>
        <p className="text-sm text-muted-foreground">{guidance}</p>
      </div>
      {ingestionStatus && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
              ingestionStatus === 'running' && 'bg-amber-100 text-amber-800',
              ingestionStatus === 'complete' && 'bg-green-100 text-green-800',
              ingestionStatus === 'error' && 'bg-red-100 text-red-800',
              ingestionStatus === 'idle' && 'bg-muted text-muted-foreground'
            )}
          >
            {ingestionStatus === 'running' && (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                Ingestion in progress
              </>
            )}
            {ingestionStatus === 'complete' && 'Ingestion complete'}
            {ingestionStatus === 'error' && 'Ingestion error'}
            {ingestionStatus === 'idle' && 'No ingestion running'}
          </span>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            Back to dashboard
          </Button>
        </Link>
        <Link to="/dashboard/settings">
          <Button variant="ghost" size="sm">
            Check settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
