import { PasswordResetRequestForm } from '@/components/auth'

/**
 * Password reset request page.
 * Public route: /password-reset
 * User enters email to receive a reset link.
 */
export default function PasswordResetRequestPage() {
  return <PasswordResetRequestForm />
}
