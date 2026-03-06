import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

export interface IPIBreakdownPanelProps {
  narrativePct: number
  credibilityPct: number
  riskPct: number
  totals?: { narrative: number; credibility: number; risk: number }
  isLoading?: boolean
  className?: string
}

const COLORS = {
  narrative: '#C8D4C0',
  credibility: '#D8C9B0',
  risk: '#E6C9C2',
}

export function IPIBreakdownPanel({
  narrativePct,
  credibilityPct,
  riskPct,
  totals,
  isLoading = false,
  className,
}: IPIBreakdownPanelProps) {
  if (isLoading) {
    return (
      <Card className={cn('rounded-card', className)}>
        <CardHeader>
          <CardTitle className="font-serif text-lg">IPI Breakdown</CardTitle>
          <CardDescription>Provisional weights: 40% Narrative / 40% Credibility / 20% Risk</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const data = [
    {
      name: 'Narrative',
      value: narrativePct,
      fill: COLORS.narrative,
      raw: totals?.narrative ?? narrativePct,
    },
    {
      name: 'Credibility',
      value: credibilityPct,
      fill: COLORS.credibility,
      raw: totals?.credibility ?? credibilityPct,
    },
    {
      name: 'Risk',
      value: riskPct,
      fill: COLORS.risk,
      raw: totals?.risk ?? riskPct,
    },
  ]

  const total = narrativePct + credibilityPct + riskPct
  const normalized = total > 0 ? data.map((d) => ({ ...d, pct: (d.value / total) * 100 })) : data

  return (
    <Card className={cn('rounded-card card-pastel', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="font-serif text-lg">IPI Breakdown</CardTitle>
          <CardDescription className="text-muted-foreground">
            Provisional weights: 40% Narrative / 40% Credibility / 20% Risk
          </CardDescription>
        </div>
        <TooltipProvider>
          <TooltipPrimitive>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="IPI breakdown explanation"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">
                Narrative: time-decayed persistence. Credibility: management language and cross-source consistency. Risk: hedging and uncertainty signals.
              </p>
            </TooltipContent>
          </TooltipPrimitive>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={normalized}
                layout="vertical"
                margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                aria-label="IPI component breakdown"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, _name: string, props: { payload?: { raw?: number } }) => [
                    `${props?.payload?.raw ?? value}`,
                    'Value',
                  ]}
                  contentStyle={{ borderRadius: 8, border: '1px solid rgb(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Contribution %">
                  {(normalized ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center gap-4">
            {(normalized ?? []).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.fill }}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className="font-serif text-lg font-semibold text-foreground">
                  {item.raw ?? item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
