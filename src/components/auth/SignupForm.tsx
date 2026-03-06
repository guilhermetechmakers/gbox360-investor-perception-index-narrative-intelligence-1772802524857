import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthLayout, AuthLayoutCard, ErrorBanner, ValidationMessage, SSOButton } from '@/components/auth'
import { useSignUp } from '@/hooks/use-auth'
import { getPasswordStrength } from '@/utils/validation'

const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    fullName: z.string().optional(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignupForm() {
  const navigate = useNavigate()
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { acceptTerms: false },
  })

  const password = watch('password', '')
  const strength = getPasswordStrength(password ?? '')

  const onSubmit = (data: SignUpFormValues) => {
    signUp.mutate(
      { email: data.email, password: data.password, fullName: data.fullName },
      {
        onSuccess: () => {
          navigate('/email-verification', { replace: true })
        },
        onError: (err: Error) =>
          setError('root', { message: err?.message ?? 'Sign up failed' }),
      }
    )
  }

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Create account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Start your free trial. We&apos;ll send a verification email to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <ErrorBanner
                message={errors.root?.message ?? ''}
                onDismiss={() => setError('root', { message: undefined })}
              />
              <div className="space-y-2">
                <Label htmlFor="signup-fullName">Full name (optional)</Label>
                <Input
                  id="signup-fullName"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  {...register('fullName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <ValidationMessage message={errors.email?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {password && (
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-medium">{strength.label}</span>
                  </p>
                )}
                <ValidationMessage message={errors.password?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirmPassword">Confirm password</Label>
                <Input
                  id="signup-confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <ValidationMessage message={errors.confirmPassword?.message} />
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="signup-acceptTerms"
                  className="mt-1 h-4 w-4 rounded border-input"
                  {...register('acceptTerms')}
                  aria-invalid={!!errors.acceptTerms}
                />
                <Label htmlFor="signup-acceptTerms" className="text-sm font-normal cursor-pointer">
                  I accept the{' '}
                  <Link to="/about#terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/about#privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <ValidationMessage message={errors.acceptTerms?.message} />
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full"
                disabled={signUp.isPending}
              >
                {signUp.isPending ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
                <span className="bg-card px-2">Or continue with</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <SSOButton provider="google" disabled />
              <SSOButton provider="microsoft" disabled />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
