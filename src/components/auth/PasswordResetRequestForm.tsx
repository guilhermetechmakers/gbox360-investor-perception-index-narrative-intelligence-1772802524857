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
  ErrorBanner,
} from '@/components/auth'
import { authApi } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useWatch } from 'react-hook-form'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export function PasswordResetRequestForm() {
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

  const onSubmit = (data: FormValues) => requestReset.mutate({ email: data.email })

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

          {requestReset.isSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200"
            >
              If an account exists for this email, you&apos;ll receive a password reset link shortly.
              Check your inbox and spam folder.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ErrorBanner
              message={requestReset.error?.message ?? ''}
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
                {...register('email')}
              />
              <EmailValidationHelper email={email ?? ''} />
              <ValidationMessage message={errors.email?.message} />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={requestReset.isPending}
            >
              {requestReset.isPending ? 'Sending...' : 'Send reset link'}
            </Button>
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
