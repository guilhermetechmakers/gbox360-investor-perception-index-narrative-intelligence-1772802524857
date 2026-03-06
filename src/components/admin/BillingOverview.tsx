import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useBillingSummary, useBillingPlans } from '@/hooks/use-admin'
import { format } from 'date-fns'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function BillingOverview() {
  const { data: summary, isLoading: summaryLoading } = useBillingSummary()
  const { data: plans = [], isLoading: plansLoading } = useBillingPlans()

  const safePlans = Array.isArray(plans) ? plans : []

  return (
    <Card className="rounded-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-lg">Billing overview</CardTitle>
        <Link to="/admin/billing">
          <Button variant="outline" size="sm" className="rounded-full">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-[#FBD8C5]/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total revenue
            </p>
            {summaryLoading ? (
              <Skeleton className="mt-1 h-6 w-20" />
            ) : (
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCurrency(summary?.totalRevenue ?? 0)}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-border/60 bg-[#C8D4C0]/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Active subscriptions
            </p>
            {summaryLoading ? (
              <Skeleton className="mt-1 h-6 w-12" />
            ) : (
              <p className="mt-1 text-lg font-semibold text-foreground">
                {summary?.activeSubscriptions ?? 0}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-border/60 bg-[#E8DED3]/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Upcoming invoices
            </p>
            {summaryLoading ? (
              <Skeleton className="mt-1 h-6 w-8" />
            ) : (
              <p className="mt-1 text-lg font-semibold text-foreground">
                {summary?.upcomingInvoices ?? 0}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-foreground">
            Subscription plans
          </h3>
          {plansLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : safePlans.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No plans configured
            </p>
          ) : (
            <Table aria-label="Plans">
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next billing</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safePlans.map((plan) => (
                  <TableRow key={plan?.id ?? ''}>
                    <TableCell className="font-medium">
                      {plan?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {plan?.status ?? '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {plan?.nextBillingDate
                        ? format(new Date(plan.nextBillingDate), 'MMM d, yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(plan?.amount ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
