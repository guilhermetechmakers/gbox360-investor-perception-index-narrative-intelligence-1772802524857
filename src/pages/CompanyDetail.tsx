import { useParams, Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCompany } from '@/hooks/use-companies'
import { useIPISnapshot, useIPITimeSeries } from '@/hooks/use-ipi'
import { useNarrativesList } from '@/hooks/use-narratives'
import { AnimatedPage } from '@/components/AnimatedPage'
import { format, subDays } from 'date-fns'
import { Download, FileText, MessageSquare, AlertCircle } from 'lucide-react'
import type { Narrative } from '@/types/narrative'

/** Empty state for narratives list: icon, message, description, optional CTA */
function NarrativesEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-muted/20 py-12 px-4 text-center"
      role="status"
      aria-label="No narratives in this time window"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
        aria-hidden
      >
        <MessageSquare className="h-7 w-7" />
      </div>
      <div className="space-y-1 max-w-sm">
        <p className="font-medium text-foreground">No narratives yet</p>
        <p className="text-sm text-muted-foreground">
          No narrative events match the selected company and time window. Try a different date range or check back after more data is ingested.
        </p>
      </div>
      <Link to="/dashboard">
        <Button variant="outline" size="sm" aria-label="Go to dashboard to change company or time window">
          Back to dashboard
        </Button>
      </Link>
    </div>
  )
}

export default function CompanyDetail() {
  const { companyId } = useParams<{ companyId: string }>()
  const id = companyId ?? ''
  const endDate = format(new Date(), 'yyyy-MM-dd')
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const { data: company, isLoading: companyLoading } = useCompany(id)
  const { data: snapshot, isLoading: snapshotLoading } = useIPISnapshot(
    id,
    startDate,
    endDate
  )
  const { data: timeSeries, isLoading: seriesLoading } = useIPITimeSeries(
    id,
    startDate,
    endDate
  )
  const { data: narratives, isLoading: narrativesLoading, isError: narrativesError, error: narrativesErrorDetail } = useNarrativesList(
    id,
    startDate,
    endDate
  )

  const series = (timeSeries ?? []).map((p) => ({
    date: format(new Date(p.date), 'MMM d'),
    score: p.score,
    narrative: p.narrative,
    credibility: p.credibility,
    risk: p.risk,
  }))

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {companyLoading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              {company?.name ?? 'Company'} {company?.symbol && `(${company.symbol})`}
            </h1>
          )}
          {company?.sector && (
            <p className="text-sm text-muted-foreground">{company.sector}</p>
          )}
        </div>
        <Button variant="outline" size="sm" aria-label="Export audit artifact">
          <Download className="mr-2 h-4 w-4" aria-hidden />
          Export audit artifact
        </Button>
      </div>

      {snapshotLoading ? (
        <Skeleton className="h-32 w-full rounded-card" />
      ) : (
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">IPI Breakdown</CardTitle>
            <CardDescription className="text-muted-foreground">
              Provisional weights: 40% Narrative / 40% Credibility / 20% Risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Narrative</p>
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {snapshot?.breakdown?.narrative ?? 65}
                </p>
                <p className="text-xs text-muted-foreground">40% weight</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Credibility</p>
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {snapshot?.breakdown?.credibility ?? 58}
                </p>
                <p className="text-xs text-muted-foreground">40% weight</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Risk</p>
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {snapshot?.breakdown?.risk ?? 42}
                </p>
                <p className="text-xs text-muted-foreground">20% weight</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">IPI timeline</CardTitle>
          <CardDescription>Time-decayed persistence (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          {seriesLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 w-full">
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
                    name="IPI"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-card" aria-labelledby="narratives-card-title" aria-describedby="narratives-card-desc">
        <CardHeader>
          <CardTitle id="narratives-card-title" className="font-serif text-lg">Narratives</CardTitle>
          <CardDescription id="narratives-card-desc" className="text-muted-foreground">Expand to see contributing events and raw payload links</CardDescription>
        </CardHeader>
        <CardContent
          aria-busy={narrativesLoading}
          aria-live="polite"
          aria-label={narrativesLoading ? 'Loading narratives' : narratives?.length ? `List of ${narratives.length} narratives` : 'No narratives'}
        >
          {narrativesLoading ? (
            <div className="space-y-2" role="status" aria-label="Loading narratives">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : narrativesError ? (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4" aria-hidden />
              <AlertTitle>Could not load narratives</AlertTitle>
              <AlertDescription>
                {narrativesErrorDetail instanceof Error
                  ? narrativesErrorDetail.message
                  : 'Something went wrong. Please try again.'}
              </AlertDescription>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => window.location.reload()}
                aria-label="Retry loading narratives"
              >
                Retry
              </Button>
            </Alert>
          ) : !narratives?.length ? (
            <NarrativesEmptyState />
          ) : (
            <ul className="space-y-2" role="list">
              {(narratives ?? []).map((n: Narrative) => (
                <li key={n.id}>
                  <Link
                    to={`/dashboard/companies/${id}/narratives/${n.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 hover:shadow-card focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`View narrative: ${n.summary}. ${n.contributionPercent}% contribution, topic ${n.topic}`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{n.summary}</p>
                      <p className="text-xs text-muted-foreground">
                        {n.contributionPercent}% contribution · {n.topic}
                      </p>
                    </div>
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
