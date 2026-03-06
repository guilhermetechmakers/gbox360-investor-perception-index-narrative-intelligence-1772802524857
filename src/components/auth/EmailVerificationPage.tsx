import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { authApi } from '@/api/auth'
import { usersApi } from '@/api/users'
import { supabase } from '@/lib/supabase'
import {
  StatusCard,
  TokenLoader,
  ResendVerification,
  NextStepsCTA,
  HelpPanel,
  LoginSignupHeader,
} from '@/components/auth/email-verification'
import type { StatusCardVariant } from '@/components/auth/email-verification'

type VerificationStatus = 'pending' | 'success' | 'expired' | 'invalid' | 'idle'

const TOKEN_MIN_LENGTH = 10

function isValidToken(token: string | null): boolean {
  return typeof token === 'string' && token.trim().length >= TOKEN_MIN_LENGTH
}

function isValidUserId(userId: string | null): boolean {
  return typeof userId === 'string' && userId.trim().length > 0
}

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const tokenParam =
    searchParams.get('token') ?? searchParams.get('token_hash') ?? ''
  const userIdParam = searchParams.get('userId') ?? ''

  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [profileStatus, setProfileStatus] = useState<{
    isComplete: boolean
    onboardingStage: string
    fieldsCompletedCount: number
  } | null>(null)
  const [nextSteps, setNextSteps] = useState<string[]>([])

  const hasToken = isValidToken(tokenParam)
  const hasUserId = isValidUserId(userIdParam)

  const fetchProfileStatus = useCallback(async (userId?: string) => {
    try {
      const res = await usersApi.getProfileStatus(userId)
      setProfileStatus({
        isComplete: res?.isComplete ?? false,
        onboardingStage: res?.onboardingStage ?? 'signup',
        fieldsCompletedCount: res?.fieldsCompletedCount ?? 0,
      })
    } catch {
      setProfileStatus({
        isComplete: false,
        onboardingStage: 'signup',
        fieldsCompletedCount: 0,
      })
    }
  }, [])

  const hasHash = typeof window !== 'undefined' && !!window.location.hash

  useEffect(() => {
    if (!hasToken || hasHash) {
      if (!hasToken) setStatus('idle')
      return
    }

    let cancelled = false
    setLoading(true)
    setStatus('pending')

    const runVerify = async () => {
      try {
        const res = await authApi.verifyToken(hasUserId ? userIdParam : '', tokenParam)
        if (cancelled) return

        if (res.success && res.status === 'verified') {
          setStatus('success')
          setMessage(res.message ?? 'Your email has been verified successfully.')
          setNextSteps(Array.isArray(res.nextSteps) ? res.nextSteps : [])
          await fetchProfileStatus(hasUserId ? userIdParam : undefined)
        } else {
          const isExpired = res.status === 'expired'
          setStatus(isExpired ? 'expired' : 'invalid')
          setMessage(
            res.message ??
              (isExpired
                ? 'This verification link has expired.'
                : 'This verification link is invalid.')
          )
        }
      } catch {
        if (cancelled) return
        setStatus('invalid')
        setMessage('Verification failed. The link may be invalid or expired.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    runVerify()
    return () => {
      cancelled = true
    }
  }, [tokenParam, userIdParam, hasToken, hasUserId, hasHash, fetchProfileStatus])

  useEffect(() => {
    if (!supabase || !window.location.hash) return
    const hash = window.location.hash
    if (!hash.includes('access_token') && !hash.includes('type=signup')) return

    setLoading(true)
    setStatus('pending')

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setStatus('success')
        setMessage('Your email has been verified successfully.')
        setLoading(false)
        fetchProfileStatus(session.user.id)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setStatus('success')
          setMessage('Your email has been verified successfully.')
          setLoading(false)
          fetchProfileStatus(session.user.id)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [fetchProfileStatus])

  useEffect(() => {
    if (status === 'success' && !profileStatus) {
      fetchProfileStatus(hasUserId ? userIdParam : undefined)
    }
  }, [status, profileStatus, hasUserId, userIdParam, fetchProfileStatus])

  const statusVariant: StatusCardVariant =
    status === 'expired' ? 'expired' : status === 'invalid' ? 'invalid' : status === 'success' ? 'success' : 'pending'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LoginSignupHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[1200px]">
          <div className="mx-auto max-w-md space-y-6 animate-fade-in-up">
            {loading && (
              <div className="rounded-[20px] bg-card p-6 shadow-card sm:rounded-[28px] sm:p-8">
                <TokenLoader />
              </div>
            )}

            {!loading && status === 'idle' && (
              <>
                <StatusCard
                  variant="pending"
                  title="Verify your email"
                  message="We've sent a verification link to your email. Click the link to activate your account. You can then sign in and go to the dashboard."
                />
                <div className="space-y-4">
                  <ResendVerification userId={hasUserId ? userIdParam : undefined} />
                  <div className="flex flex-col gap-3">
                    <Link to="/dashboard" className="block">
                      <Button size="lg" className="w-full rounded-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-primary">
                      Back to sign in
                    </Link>
                  </div>
                </div>
                <HelpPanel />
              </>
            )}

            {!loading && status === 'success' && (
              <>
                <StatusCard
                  variant="success"
                  title="Verification successful"
                  message={message || 'Your account is active. You can sign in and go to the dashboard.'}
                />
                <NextStepsCTA
                  isProfileComplete={profileStatus?.isComplete ?? true}
                  nextSteps={nextSteps}
                />
                <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-primary">
                  Back to sign in
                </Link>
              </>
            )}

            {!loading && (status === 'expired' || status === 'invalid') && (
              <>
                <StatusCard
                  variant={statusVariant}
                  title={
                    status === 'expired'
                      ? 'Token expired or invalid'
                      : 'Verification link invalid'
                  }
                  message={
                    message ||
                    'Request a new verification email or try signing in.'
                  }
                />
                <div className="space-y-4">
                  <ResendVerification userId={hasUserId ? userIdParam : undefined} />
                  <Link to="/login" className="block">
                    <Button size="lg" className="w-full rounded-full">
                      Back to sign in
                    </Button>
                  </Link>
                </div>
                <HelpPanel />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
