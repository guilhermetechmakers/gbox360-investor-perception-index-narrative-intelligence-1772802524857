import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Analytics() {
  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Analytics & reports</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">—</p>
            <p className="text-xs text-muted-foreground">Key metric</p>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">—</p>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">SLA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">—</p>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Report builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Scheduled reports and report builder will appear here.</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
