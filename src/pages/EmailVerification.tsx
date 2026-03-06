import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useResendVerification } from '@/hooks/use-auth'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Mail } from 'lucide-react'

export default function EmailVerification() {
  const resend = useResendVerification()

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-card shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email. Click the link to activate your account.
            You can then sign in and go to the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            disabled={resend.isPending}
            onClick={() => resend.mutate()}
          >
            {resend.isPending ? 'Sending...' : 'Resend verification email'}
          </Button>
          <Link to="/dashboard" className="block">
            <Button className="w-full">Go to dashboard</Button>
          </Link>
          <Link
            to="/login"
            className="block text-center text-sm text-muted-foreground hover:text-primary"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
