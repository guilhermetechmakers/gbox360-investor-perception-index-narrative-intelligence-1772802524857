import { useSearchParams, useNavigate } from 'react-router-dom'
import { PasswordResetRequestForm, PasswordResetTokenForm } from '@/components/auth'

function getTokenFromUrl(searchParams: URLSearchParams): string {
  const tokenFromUrl = searchParams.get('token') ?? ''
  if (tokenFromUrl.trim()) return tokenFromUrl
  if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
    return 'recovery'
  }
  return ''
}

export default function PasswordReset() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = getTokenFromUrl(searchParams)

  const showConfirmForm = token.length > 0

  if (showConfirmForm) {
    return (
      <PasswordResetTokenForm
        token={token}
        onSuccess={() => navigate('/login')}
      />
    )
  }

  return <PasswordResetRequestForm />
}
