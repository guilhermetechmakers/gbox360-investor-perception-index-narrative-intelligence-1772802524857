import { useSearchParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  PasswordResetTokenForm,
  TokenPresenceIndicator,
  BackToLoginLink,
  AuthLayout,
  AuthLayoutCard,
} from '@/components/auth'

function getTokenFromUrl(searchParams: URLSearchParams): string {
  const tokenFromUrl = searchParams.get('token') ?? ''
  if (tokenFromUrl.trim()) return tokenFromUrl
  if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
    return 'recovery'
  }
  return ''
}

/**
 * Password reset confirm page (token-scoped).
 * Public route: /reset-password?token=XYZ or /reset-password#... (Supabase recovery hash)
 * User sets new password when token is present; otherwise shown guidance to use email link.
 */
export default function PasswordResetConfirmPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = getTokenFromUrl(searchParams)
  const hasToken = token.length > 0

  if (hasToken) {
    return (
      <PasswordResetTokenForm
        token={token}
        isRecoveryFlow={token === 'recovery'}
        onSuccess={() => navigate('/login')}
      />
    )
  }

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the link from your password reset email to set a new password.
            </p>
          </div>
          <TokenPresenceIndicator hasToken={false} />
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/password-reset"
              className="text-sm font-medium text-primary hover:underline"
            >
              Send a new reset link
            </Link>
            <BackToLoginLink />
          </div>
        </div>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
