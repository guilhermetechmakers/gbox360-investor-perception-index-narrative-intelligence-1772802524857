import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Users, BarChart3, Server, FileCheck, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'size-5'

export default function AdminDashboard() {
  const [isLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const events: unknown[] = []

  if (error) {
    return (
      <AnimatedPage className="space-y-6">
        <h1 className="text-foreground">Admin dashboard</h1>
        <Card className="rounded-card border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className={cn(ICON_SIZE, 'text-destructive')} aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Failed to load admin overview</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button
              variant="default"
              onClick={() => setError(null)}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <h1 className="text-foreground">Admin dashboard</h1>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="size-5 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/users" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Card className="rounded-card bg-card text-card-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">User management</CardTitle>
                <Users className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Invite, edit, audit log</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/ingestion" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Card className="rounded-card bg-card text-card-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Ingestion monitor</CardTitle>
                <Server className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Source status, retry queue</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/analytics" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Card className="rounded-card bg-card text-card-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Analytics & reports</CardTitle>
                <BarChart3 className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Metrics, report builder</p>
              </CardContent>
            </Card>
          </Link>
          <Card className="rounded-card bg-card text-card-foreground shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">System health</CardTitle>
              <FileCheck className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Events log, quick links</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="rounded-card bg-card text-card-foreground shadow-card">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold leading-none tracking-tight text-card-foreground">Events log</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[90%] rounded-md" />
              <Skeleton className="h-4 w-[70%] rounded-md" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <FileText className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">No events yet</p>
                <p className="text-sm text-muted-foreground">
                  Platform events and admin actions will appear here when they occur.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Platform events and admin actions will appear here.</p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
