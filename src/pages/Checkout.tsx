import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Empty state for invoice history: icon, message, description, CTA */
function InvoiceHistoryEmptyState({
  onSelectPlan,
  className,
}: {
  onSelectPlan?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-8 text-center',
        className
      )}
      aria-live="polite"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
        aria-hidden
      >
        <Receipt className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-foreground">No invoices yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Invoices will appear here after your first subscription payment.
        </p>
      </div>
      {onSelectPlan && (
        <Button
          type="button"
          size="sm"
          onClick={onSelectPlan}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Select a plan
        </Button>
      )}
    </div>
  )
}

export default function Checkout() {
  const planCardRef = useRef<HTMLDivElement>(null)
  const hasInvoices = false

  const scrollToPlanSelector = () => {
    planCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card ref={planCardRef} className="rounded-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Plan selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">Starter</p>
                <p className="text-sm text-muted-foreground">For small teams</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">$—/mo</span>
                <Button size="sm">Select</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Secure payment via Stripe. PCI handled by provider.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Invoice history</CardTitle>
          </CardHeader>
          <CardContent>
            {hasInvoices ? (
              <p className="text-sm text-muted-foreground">Past invoices will appear here.</p>
            ) : (
              <InvoiceHistoryEmptyState onSelectPlan={scrollToPlanSelector} />
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
