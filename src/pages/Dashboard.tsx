import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompanies, useCompanySearch } from '@/hooks/use-companies'
import { useIPISnapshot, useIPITimeSeries } from '@/hooks/use-ipi'
import { useTopNarratives } from '@/hooks/use-narratives'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Search, TrendingUp, TrendingDown, FileText, Download } from 'lucide-react'
import { subDays, format } from 'date-fns'

// Mock data when API is not available
const MOCK_IPI_SERIES = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(new Date(), 13 - i), 'MMM d'),
  score: 55 + Math.sin(i * 0.5) * 10 + i * 0.5,
}))
const MOCK_NARRATIVES = [
  { id: '1', summary: 'Strong Q3 earnings beat and raised guidance', contributionPercent: 42, topic: 'Earnings' },
  { id: '2', summary: 'Management commentary on supply chain normalization', contributionPercent: 28, topic: 'Operations' },
  { id: '3', summary: 'ESG initiatives and sustainability targets', contributionPercent: 18, topic: 'Governance' },
]

export default function Dashboard() {
  const [companyId, setCompanyId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const endDate = format(new Date(), 'yyyy-MM-dd')
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const { data: companies } = useCompanies()
  const { data: searchResults } = useCompanySearch(searchQuery)
  const { data: ipiSnapshot, isLoading: ipiLoading } = useIPISnapshot(
    companyId || (companies?.[0]?.id ?? ''),
    startDate,
    endDate
  )
  const { data: timeSeries, isLoading: seriesLoading } = useIPITimeSeries(
    companyId || (companies?.[0]?.id ?? ''),
    startDate,
    endDate
  )
  const { data: narratives, isLoading: narrativesLoading } = useTopNarratives(
    companyId || (companies?.[0]?.id ?? ''),
    3,
    startDate,
    endDate
  )

  const displayCompanies = searchQuery.length >= 2 ? searchResults : companies
  const selectedId = companyId || companies?.[0]?.id
  const snapshot = ipiSnapshot ?? null
  const series: { date: string; score: number }[] = (timeSeries?.length ? timeSeries : MOCK_IPI_SERIES).map((p) => ({
    date: 'date' in p ? format(new Date((p as { date: string }).date), 'MMM d') : (p as { date: string }).date,
    score: (p as { score: number }).score,
  }))
  const topNarratives = (narratives?.length ? narratives : MOCK_NARRATIVES) as Array<{
    id: string
    summary: string
    contributionPercent: number
    topic: string
  }>

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={selectedId ?? ''}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Select company</option>
            {displayCompanies?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.symbol ? `(${c.symbol})` : ''}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export / Audit
          </Button>
        </div>
      </div>

      {ipiLoading ? (
        <Skeleton className="h-40 w-full rounded-card" />
      ) : (
        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-serif text-lg">IPI Overview</CardTitle>
            <span className="text-sm text-muted-foreground">
              Last 30 days · Weights: 40% Narrative / 40% Credibility / 20% Risk (provisional)
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Current score</p>
                <p className="font-serif text-4xl font-bold text-foreground">
                  {snapshot?.score ?? 62}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {(snapshot?.delta ?? 2.4) >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className={(snapshot?.delta ?? 2.4) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {(snapshot?.delta ?? 2.4) >= 0 ? '+' : ''}
                  {snapshot?.delta ?? 2.4}%
                </span>
                <span className="text-muted-foreground">vs prior period</span>
              </div>
            </div>
            {seriesLoading ? (
              <Skeleton className="mt-4 h-32 w-full" />
            ) : (
              <div className="mt-6 h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
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
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Top 3 narratives</CardTitle>
            <CardDescription>Driving perception in the selected window</CardDescription>
          </CardHeader>
          <CardContent>
            {narrativesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {topNarratives.map((n) => (
                  <li key={n.id}>
                    <Link
                      to={`/dashboard/companies/${selectedId}/narratives/${n.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{n.summary}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {n.contributionPercent}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{n.topic}</p>
                      <span className="mt-2 inline-block text-xs text-primary hover:underline">
                        Why did this move? →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Recent events</CardTitle>
            <CardDescription>Latest narrative events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Events feed will show recent narrative events here.</p>
              <Button variant="outline" size="sm" className="mt-2">
                <FileText className="mr-2 h-4 w-4" />
                View all events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        IPI weights are provisional and visible in exports. Raw payloads are preserved for audit.
      </p>
    </AnimatedPage>
  )
}
