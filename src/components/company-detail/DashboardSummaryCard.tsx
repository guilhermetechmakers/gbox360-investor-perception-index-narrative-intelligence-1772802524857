import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Narrative } from '@/types/narrative'

export interface DashboardSummaryCardProps {
  companyId: string
  timeWindow?: string
  currentIpi: number | null | undefined
  delta: number | null | undefined
  topNarratives: Narrative[]
  isLoading?: boolean
  className?: string
}

export function DashboardSummaryCard({
  companyId,
  timeWindow: _timeWindow,
  currentIpi,
  delta,
  topNarratives,
  isLoading = false,
  className,
}: DashboardSummaryCardProps) {
  void _timeWindow
  const score = currentIpi ?? 0
  const deltaVal = delta ?? 0
  const isPositive = deltaVal >= 0
  const safeNarratives = Array.isArray(topNarratives) ? topNarratives : []

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-serif text-lg">IPI Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'rounded-card card-pastel bg-white transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-serif text-lg">IPI Overview</CardTitle>
        <Link to={`/dashboard/companies/${companyId}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            View details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Current score</p>
            <p className="font-serif text-4xl font-bold text-foreground">{score}</p>
          </div>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600" aria-hidden />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" aria-hidden />
            )}
            <span
              className={cn(
                'font-medium',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {isPositive ? '+' : ''}
              {deltaVal}%
            </span>
            <span className="text-muted-foreground">vs prior period</span>
          </div>
        </div>
        {safeNarratives.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">Top narratives</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {safeNarratives.slice(0, 3).map((n) => (
                <li key={n.id}>
                  <Link
                    to={`/dashboard/companies/${companyId}/narratives/${n.id}`}
                    className="hover:text-foreground hover:underline"
                  >
                    {n.summary ?? n.id} · {n.contributionPercent ?? 0}%
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <Link to={`/dashboard/companies/${companyId}`}>
            <Button variant="default" size="sm" className="rounded-full">
              Full company detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
