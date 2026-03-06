import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBillingSummary, useInvoices, usePlans } from '@/hooks/use-admin'
import { DollarSign, CreditCard, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'h-5 w-5'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function BillingSubscriptionsPanel() {
  const { data: summary, isLoading: summaryLoading } = useBillingSummary()
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices(5, 0)
  const { data: plans = [], isLoading: plansLoading } = usePlans()

  const safeInvoices = Array.isArray(invoices) ? invoices : []
  const safePlans = Array.isArray(plans) ? plans : []

  return (
    <div className="space-y-6">
      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-card bg-[#FBD8C5]/50 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total revenue
            </CardTitle>
            <DollarSign className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(summary?.totalRevenue ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">This period</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#C8D4C0]/40 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Active subscriptions
            </CardTitle>
            <TrendingUp className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <>
                <p className="text-2xl font-semibold text-foreground">
                  {summary?.activeSubscriptions ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Active plans</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#E8DED3]/60 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Upcoming invoices
            </CardTitle>
            <CreditCard className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <>
                <p className="text-2xl font-semibold text-foreground">
                  {summary?.upcomingInvoices ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Due soon</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#D8C9B0]/50 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Seats by plan
            </CardTitle>
            <Users className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <p className="text-sm text-foreground">
                {Object.entries(summary?.seatsByPlan ?? {}).length > 0
                  ? Object.entries(summary?.seatsByPlan ?? {})
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')
                  : '—'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plans & Invoices */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Plans</CardTitle>
            <Link to="/dashboard/checkout">
              <Button variant="outline" size="sm">
                Manage plans
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {plansLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : safePlans.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No plans configured
              </p>
            ) : (
              <div className="space-y-2">
                {safePlans.map((plan) => (
                  <div
                    key={plan?.id ?? ''}
                    className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{plan?.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {plan?.seatsIncluded ?? 0} seats · {formatCurrency(plan?.price ?? 0, plan?.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Recent invoices</CardTitle>
            <Link to="/admin/billing">
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : safeInvoices.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No invoices yet
              </p>
            ) : (
              <Table aria-label="Recent invoices">
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeInvoices.map((inv) => (
                    <TableRow key={inv?.id ?? ''}>
                      <TableCell className="font-medium">
                        {formatCurrency(inv?.amountDue ?? 0)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {inv?.dueDate ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inv?.status === 'paid'
                              ? 'success'
                              : inv?.status === 'overdue'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {inv?.status ?? '—'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
