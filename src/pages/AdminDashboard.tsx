import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  BillingSubscriptionsPanel,
  AdminControlsPanel,
  RecentAdminActionsPanel,
  QuickAccessTiles,
  AdminDashboardOverview,
} from '@/components/admin'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'size-5'

export default function AdminDashboard() {
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return (
      <AnimatedPage className="space-y-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Admin dashboard
        </h1>
        <Card className="rounded-card border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className={cn(ICON_SIZE, 'text-destructive')} aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Failed to load admin overview</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="default" onClick={() => setError(null)}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Admin dashboard
        </h1>
        <Link to="/about">
          <Button variant="outline" size="sm">
            Help
          </Button>
        </Link>
      </div>

      {/* KPI overview tiles */}
      <AdminDashboardOverview />

      {/* Quick access tiles */}
      <QuickAccessTiles />

      {/* Main content: tabs for Billing, Admin Controls, Recent Actions */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="rounded-lg bg-muted/60 p-1">
          <TabsTrigger value="overview" className="rounded-md">
            Overview
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-md">
            Billing & subscriptions
          </TabsTrigger>
          <TabsTrigger value="controls" className="rounded-md">
            Admin controls
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminControlsPanel />
            <RecentAdminActionsPanel />
          </div>
        </TabsContent>
        <TabsContent value="billing" className="space-y-6">
          <BillingSubscriptionsPanel />
        </TabsContent>
        <TabsContent value="controls" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminControlsPanel />
            <RecentAdminActionsPanel />
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  )
}
