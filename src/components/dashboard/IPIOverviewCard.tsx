import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface SparklinePoint {
  date: string
  score: number
}

export interface IPIOverviewCardProps {
  ipiScore: number | null | undefined
  delta: number | null | undefined
  lastUpdated: string | null | undefined
  sparklineData: SparklinePoint[]
  isLoading?: boolean
  className?: string
}

export function IPIOverviewCard({
  ipiScore,
  delta,
  lastUpdated,
  sparklineData,
  isLoading = false,
  className,
}: IPIOverviewCardProps) {
  const score = ipiScore ?? 0
  const deltaVal = delta ?? 0
  const isPositive = deltaVal >= 0
  const safeSparkline = Array.isArray(sparklineData) ? sparklineData : []
  const hasSparkline = safeSparkline.length > 0

  if (isLoading) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-serif text-lg">IPI Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'rounded-card card-pastel bg-white',
        className
      )}
      aria-labelledby="ipi-overview-title"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle id="ipi-overview-title" className="font-serif text-lg">
          IPI Overview
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          Weights: 40% Narrative / 40% Credibility / 20% Risk (provisional)
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Current score</p>
            <p className="font-serif text-4xl font-bold text-foreground">
              {score}
            </p>
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
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated:{' '}
              {format(new Date(lastUpdated), 'MMM d, yyyy HH:mm')}
            </p>
          )}
        </div>
        {hasSparkline && (
          <div className="mt-6 h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safeSparkline}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
