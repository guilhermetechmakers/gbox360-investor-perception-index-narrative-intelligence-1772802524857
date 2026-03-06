import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
} from '@/components/ui/table'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useBillingSummary, useInvoices, usePlans, useSeatAdjust } from '@/hooks/use-admin'
import { DollarSign, CreditCard, FileText, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export default function AdminBilling() {
  const { data: summary, isLoading: summaryLoading } = useBillingSummary()
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices(20, 0)
  const { data: plans = [], isLoading: plansLoading } = usePlans()
  const seatAdjust = useSeatAdjust()
  const [seatSubscriptionId, setSeatSubscriptionId] = useState('')
  const [seatDelta, setSeatDelta] = useState('')

  const safeInvoices = Array.isArray(invoices) ? invoices : []
  const safePlans = Array.isArray(plans) ? plans : []

  const handleSeatAdjust = () => {
    const subId = seatSubscriptionId.trim()
    const delta = parseInt(seatDelta, 10)
    if (!subId || isNaN(delta)) {
      toast.error('Enter subscription ID and seats delta')
      return
    }
    seatAdjust.mutate(
      { subscriptionId: subId, seatsDelta: delta },
      {
        onSuccess: () => {
          setSeatSubscriptionId('')
          setSeatDelta('')
        },
      }
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Billing & subscriptions
      </h1>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-card bg-[#FBD8C5]/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-semibold">
                {formatCurrency(summary?.totalRevenue ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#C8D4C0]/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active subscriptions</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-semibold">
                {summary?.activeSubscriptions ?? 0}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#E8DED3]/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming invoices</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <p className="text-2xl font-semibold">
                {summary?.upcomingInvoices ?? 0}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-card bg-[#D8C9B0]/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seats by plan</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <p className="text-sm">
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

      {/* Seat adjustment */}
      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Adjust seats (enterprise)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Input
            placeholder="Subscription ID"
            value={seatSubscriptionId}
            onChange={(e) => setSeatSubscriptionId(e.target.value)}
            className="max-w-xs"
          />
          <Input
            type="number"
            placeholder="Seats delta (+/-)"
            value={seatDelta}
            onChange={(e) => setSeatDelta(e.target.value)}
            className="max-w-[120px]"
          />
          <Button
            onClick={handleSeatAdjust}
            disabled={seatAdjust.isPending}
          >
            {seatAdjust.isPending ? 'Updating...' : 'Adjust seats'}
          </Button>
        </CardContent>
      </Card>

      {/* Plans & Invoices */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {plansLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
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
                      <p className="font-medium">{plan?.name ?? '—'}</p>
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
          <CardHeader>
            <CardTitle className="font-serif text-lg">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <Table aria-label="Invoices">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeInvoices.length === 0 ? (
                    <TableEmpty
                      colSpan={4}
                      message="No invoices yet"
                      description="Invoices will appear here when subscriptions are active."
                    />
                  ) : (
                    safeInvoices.map((inv) => (
                      <TableRow key={inv?.id ?? ''}>
                        <TableCell className="font-mono text-xs">{inv?.id ?? '—'}</TableCell>
                        <TableCell>{formatCurrency(inv?.amountDue ?? 0)}</TableCell>
                        <TableCell>{inv?.dueDate ?? '—'}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
