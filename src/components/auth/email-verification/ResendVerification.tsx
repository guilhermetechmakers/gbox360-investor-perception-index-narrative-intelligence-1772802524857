import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { authApi } from '@/api/auth'
import { toast } from 'sonner'

const COOLDOWN_SECONDS = 60

export interface ResendVerificationProps {
  userId?: string | null
  disabled?: boolean
  onSuccess?: () => void
  onError?: (err: Error) => void
}

export function ResendVerification({
  userId,
  disabled = false,
  onSuccess,
  onError,
}: ResendVerificationProps) {
  const [cooldown, setCooldown] = useState(0)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0 || isPending) return
    setIsPending(true)
    try {
      await authApi.resendToken(userId ?? undefined)
      setCooldown(COOLDOWN_SECONDS)
      toast.success('Verification email sent. Check your inbox.')
      onSuccess?.()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to resend')
      toast.error(error.message)
      onError?.(error)
    } finally {
      setIsPending(false)
    }
  }

  const isDisabled = disabled || isPending || cooldown > 0

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full rounded-full"
      disabled={isDisabled}
      onClick={handleResend}
      aria-label={
        cooldown > 0
          ? `Resend available in ${cooldown} seconds`
          : 'Resend verification email'
      }
    >
      {isPending
        ? 'Sending...'
        : cooldown > 0
          ? `Resend in ${cooldown}s`
          : 'Resend verification email'}
    </Button>
  )
}
