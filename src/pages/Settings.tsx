import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCurrentUser } from '@/hooks/use-auth'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Skeleton } from '@/components/ui/skeleton'

export default function Settings() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <AnimatedPage>
        <Skeleton className="h-64 w-full rounded-card" />
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Settings</h1>
      <Card className="rounded-card max-w-xl">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Notifications</CardTitle>
          <CardDescription>Choose how you receive updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email notifications</Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="narrative-alerts">Narrative alerts</Label>
            <Switch id="narrative-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-card max-w-xl">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Data & integrations</CardTitle>
          <CardDescription>Data retention and linked integrations (placeholder).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Data retention and integration settings will appear here.
          </p>
        </CardContent>
      </Card>
      {user?.role === 'admin' && (
        <Card className="rounded-card max-w-xl">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Weighting overrides (admin)</CardTitle>
            <CardDescription>Provisional IPI weights. For admin use only.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Narrative / Credibility / Risk weight overrides will be configurable here.
            </p>
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  )
}
