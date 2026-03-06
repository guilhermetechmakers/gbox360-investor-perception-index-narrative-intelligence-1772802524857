import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLayoutCard, ValidationMessage } from '@/components/auth'
import { authApi } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export function PasswordResetRequestForm() {
  const requestReset = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Request failed')
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
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
          {requestReset.isSuccess && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-800 dark:text-green-200">
              Check your email for a link to reset your password.
            </div>
          )}
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
