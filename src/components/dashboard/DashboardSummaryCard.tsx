import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { NarrativeContribution } from '@/types/dashboard'

export interface DashboardSummaryCardProps {
  companyId: string
  companyName?: string
  window: string
  currentIpi: number
  delta: number
  topNarratives: NarrativeContribution[]
  className?: string
}

export interface SparklinePoint {
  date: string
  score: number
}

export function DashboardSummaryCard({
  companyId,
  companyName,
  window,
  currentIpi,
  delta,
  topNarratives,
  className,
}: DashboardSummaryCardProps) {
  const safeNarratives = Array.isArray(topNarratives) ? topNarratives.slice(0, 3) : []
  const isPositive = delta >= 0

  const sparklineData: SparklinePoint[] = []
  const points = 7
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const t = (points - i) / points
    const score = Math.min(100, Math.max(0, currentIpi - delta * (1 - t)))
    sparklineData.push({
      date: format(d, 'MMM d'),
      score,
    })
  }
  if (sparklineData.length === 0) {
    sparklineData.push({ date: 'Now', score: currentIpi })
  }

  return (
    <Link to={`/dashboard/companies/${companyId}`}>
      <Card
        className={cn(
          'rounded-card card-pastel transition-all duration-200 hover:shadow-card-hover',
          'bg-cardPastel-cream border-border',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {companyName ?? 'Company'} · {window}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-foreground">
                  {currentIpi}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" aria-hidden />
                  ) : (
                    <TrendingDown className="h-4 w-4" aria-hidden />
                  )}
                  {isPositive ? '+' : ''}{delta}%
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
          {sparklineData.length > 0 && (
            <div className="mt-4 h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <CartesianGrid strokeDasharray="2 2" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="rgb(var(--primary))"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {safeNarratives.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
              Top: {safeNarratives.map((n) => n.title ?? '—').slice(0, 1).join(', ')}
            </p>
          )}
          <span className="mt-2 inline-flex items-center text-xs font-medium text-primary">
            View company detail
            <ChevronRight className="ml-1 h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
