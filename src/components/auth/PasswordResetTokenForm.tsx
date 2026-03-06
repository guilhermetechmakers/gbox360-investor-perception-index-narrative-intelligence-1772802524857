import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLayoutCard, ErrorBanner, ValidationMessage } from '@/components/auth'
import { authApi } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getPasswordStrength } from '@/utils/validation'

const schema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export interface PasswordResetTokenFormProps {
  token: string
  onSuccess?: () => void
}

export function PasswordResetTokenForm({ token, onSuccess }: PasswordResetTokenFormProps) {
  const confirmReset = useMutation({
    mutationFn: (input: { token: string; newPassword: string; confirmPassword: string }) =>
      authApi.confirmPasswordReset({
        token: input.token,
        newPassword: input.newPassword,
        confirmPassword: input.confirmPassword,
      }),
    onSuccess: () => {
      toast.success('Password updated. You can sign in now.')
      onSuccess?.()
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Reset failed')
    },
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token },
  })

  const newPassword = watch('newPassword', '')
  const strength = getPasswordStrength(newPassword ?? '')

  const onSubmit = (data: FormValues) =>
    confirmReset.mutate({
      token: data.token,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    })

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below. Use the link from your email.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ErrorBanner
              message={confirmReset.error?.message ?? ''}
              onDismiss={() => confirmReset.reset()}
            />
            <input type="hidden" {...register('token')} />
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register('newPassword')}
              />
              {newPassword && (
                <p className="text-xs text-muted-foreground">
                  Strength: <span className="font-medium">{strength.label}</span>
                </p>
              )}
              <ValidationMessage message={errors.newPassword?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <ValidationMessage message={errors.confirmPassword?.message} />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={confirmReset.isPending}
            >
              {confirmReset.isPending ? 'Updating...' : 'Update password'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
