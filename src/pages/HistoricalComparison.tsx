import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function HistoricalComparison() {
  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Historical comparison</h1>
      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg">MVP placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Selection controls, side-by-side IPI charts, persistence heatmaps, and cross-window
            persistent narratives list will be available here.
          </p>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
