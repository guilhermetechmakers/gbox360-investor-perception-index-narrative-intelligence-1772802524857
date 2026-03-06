import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface TimelineEvent {
  date: string
  score?: number
  narrative?: number
  credibility?: number
  risk?: number
}

export interface NarrativeTimelineProps {
  events: TimelineEvent[]
  windowRange?: { start: string; end: string }
  isLoading?: boolean
  className?: string
}

export function NarrativeTimeline({
  events,
  windowRange = { start: '', end: '' },
  isLoading = false,
  className,
}: NarrativeTimelineProps) {
  const safeEvents = Array.isArray(events) ? events : []
  const chartData = safeEvents.map((e) => ({
    date: format(new Date(e.date), 'MMM d'),
    fullDate: e.date,
    score: e.score ?? 0,
    narrative: e.narrative ?? 0,
    credibility: e.credibility ?? 0,
    risk: e.risk ?? 0,
  }))

  if (isLoading) {
    return (
      <Card className={cn('rounded-card', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">IPI Timeline</CardTitle>
          <CardDescription>Time-decayed narrative persistence</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className={cn('rounded-card card-pastel', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">IPI Timeline</CardTitle>
          <CardDescription>Time-decayed narrative persistence</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-muted-foreground"
            role="status"
            aria-label="No timeline data available"
          >
            <p className="text-sm">No data for this time window</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn('rounded-card card-pastel', className)}
      aria-labelledby="timeline-title"
    >
      <CardHeader>
        <CardTitle id="timeline-title" className="font-serif text-lg">
          IPI Timeline
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {windowRange.start && windowRange.end
            ? `Time-decayed persistence · ${windowRange.start} to ${windowRange.end}`
            : 'Time-decayed narrative persistence'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [value, 'Score']}
                labelFormatter={(label, payload) => {
                  const p = payload?.[0]?.payload
                  return p?.fullDate ? format(new Date(p.fullDate), 'MMM d, yyyy') : label
                }}
              />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  name="IPI"
                />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
