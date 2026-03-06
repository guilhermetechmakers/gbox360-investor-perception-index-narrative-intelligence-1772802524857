import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Checkout() {
  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-card">
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
            <p className="text-sm text-muted-foreground">Past invoices will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  )
}
