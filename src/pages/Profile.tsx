import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCurrentUser } from '@/hooks/use-auth'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Skeleton } from '@/components/ui/skeleton'

export default function Profile() {
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
      <h1 className="font-serif text-2xl font-semibold text-foreground">Profile</h1>
      <Card className="rounded-card max-w-xl">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Personal details</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email ?? ''} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your name"
              defaultValue={user?.fullName ?? ''}
            />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>
      <Card className="rounded-card max-w-xl">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Security</CardTitle>
          <CardDescription>Change password and account actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change password</Button>
          <Button variant="destructive">Delete account</Button>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
