import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AuthLayout,
  AuthLayoutCard,
  ValidationMessage,
  EmailValidationHelper,
  SecurityTipsCard,
  BackToLoginLink,
  ErrorDisplay,
} from '@/components/auth'
import { authApi } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useWatch } from 'react-hook-form'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export interface PasswordResetRequestFormProps {
  /** Optional custom submit handler; when provided, called with email instead of default API */
  onSubmit?: (email: string) => void | Promise<void>
}

export function PasswordResetRequestForm({ onSubmit: onSubmitProp }: PasswordResetRequestFormProps = {}) {
  const requestReset = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('If an account exists for this email, you\'ll receive a password reset link shortly.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Request failed')
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const email = useWatch({ control, name: 'email', defaultValue: '' })

  const onSubmit = (data: FormValues) => {
    if (onSubmitProp) {
      void Promise.resolve(onSubmitProp(data.email))
      return
    }
    requestReset.mutate({ email: data.email })
  }

  const isSubmitting = onSubmitProp ? false : requestReset.isPending
  const errorMessage = onSubmitProp ? '' : (requestReset.error?.message ?? '')
  const isSuccess = onSubmitProp ? false : requestReset.isSuccess

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          {isSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-black/8 bg-cardPastel-sage/30 p-4 text-sm text-foreground"
            >
              If an account exists for this email, you&apos;ll receive a password reset link shortly.
              Check your inbox and spam folder.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ErrorDisplay
              message={errorMessage}
              onDismiss={() => requestReset.reset()}
            />
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby="reset-email-helper"
                className="rounded-lg border-black/8"
                {...register('email')}
              />
              <EmailValidationHelper email={email ?? ''} />
              <ValidationMessage message={errors.email?.message} />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-primary text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Reset link usually arrives within a few minutes. Check your spam folder if you don&apos;t see it.
            </p>
          </form>

          <SecurityTipsCard variant="request" />

          <div className="flex justify-center">
            <BackToLoginLink />
          </div>
        </div>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
