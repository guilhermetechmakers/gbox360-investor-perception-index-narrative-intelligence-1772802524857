import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthLayout, AuthLayoutCard } from '@/components/auth'
import { authApi } from '@/api/auth'
import { useResendVerification } from '@/hooks/use-auth'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export type VerificationStatus = 'idle' | 'pending' | 'success' | 'expired' | 'error'

export function EmailVerificationStatus() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<VerificationStatus>(token ? 'pending' : 'idle')
  const [message, setMessage] = useState<string>('')
  const resend = useResendVerification()

  useEffect(() => {
    if (!token?.trim()) return
    let cancelled = false
    setStatus('pending')
    authApi
      .verifyEmail(token)
      .then((res) => {
        if (cancelled) return
        setStatus(res.success ? 'success' : 'expired')
        setMessage(res.message ?? '')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
        setMessage('Verification failed. The link may be invalid or expired.')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <div className="space-y-6 text-center">
          {status === 'pending' && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Verifying your email
              </h1>
              <p className="text-sm text-muted-foreground">
                Please wait...
              </p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Email verified
              </h1>
              <p className="text-sm text-muted-foreground">
                {message || 'Your account is active. You can sign in and go to the dashboard.'}
              </p>
              <Link to="/dashboard" className="block">
                <Button size="lg" className="w-full rounded-full">
                  Go to dashboard
                </Button>
              </Link>
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-primary">
                Back to sign in
              </Link>
            </>
          )}
          {(status === 'expired' || status === 'error') && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive" aria-hidden />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Verification link invalid or expired
              </h1>
              <p className="text-sm text-muted-foreground">
                {message || 'Request a new verification email or try signing in.'}
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={resend.isPending}
                  onClick={() => resend.mutate()}
                >
                  {resend.isPending ? 'Sending...' : 'Resend verification email'}
                </Button>
                <Link to="/login">
                  <Button size="lg" className="w-full rounded-full">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </>
          )}
          {status === 'idle' && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" aria-hidden />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Verify your email
              </h1>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a verification link to your email. Click the link to activate your account.
                You can then sign in and go to the dashboard.
              </p>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={resend.isPending}
                  onClick={() => resend.mutate()}
                >
                  {resend.isPending ? 'Sending...' : 'Resend verification email'}
                </Button>
                <Link to="/dashboard" className="block">
                  <Button size="lg" className="w-full rounded-full">
                    Go to dashboard
                  </Button>
                </Link>
                <Link
                  to="/login"
                  className="block text-sm text-muted-foreground hover:text-primary"
                >
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
