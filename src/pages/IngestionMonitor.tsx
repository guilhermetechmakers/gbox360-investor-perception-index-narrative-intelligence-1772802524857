import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { RefreshCw } from 'lucide-react'

export default function IngestionMonitor() {
  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Ingestion monitor</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News API</CardTitle>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-600">OK</span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Source status</p>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social API</CardTitle>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-600">OK</span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Source status</p>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transcripts</CardTitle>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-600">OK</span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Batch ingestion</p>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-lg">Retry queue</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Manual re-run
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed jobs and idempotency log will appear here.</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
