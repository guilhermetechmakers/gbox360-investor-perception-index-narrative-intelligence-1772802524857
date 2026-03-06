import { useSearchParams, useNavigate } from 'react-router-dom'
import { PasswordResetRequestForm, PasswordResetTokenForm } from '@/components/auth'

export default function PasswordReset() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  if (token.trim()) {
    return (
      <PasswordResetTokenForm
        token={token}
        onSuccess={() => navigate('/login')}
      />
    )
  }

  return <PasswordResetRequestForm />
}
