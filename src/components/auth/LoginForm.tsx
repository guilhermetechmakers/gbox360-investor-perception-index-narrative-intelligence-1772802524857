import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthLayout, AuthLayoutCard, ErrorBanner, ValidationMessage, SSOButton } from '@/components/auth'
import { useSignIn } from '@/hooks/use-auth'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const signIn = useSignIn()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { remember: true },
  })

  const onSubmit = (data: SignInFormValues) => {
    signIn.mutate(
      { email: data.email, password: data.password, remember: data.remember },
      {
        onSuccess: () => {
          navigate(from, { replace: true })
        },
        onError: (err: Error) =>
          setError('root', { message: err?.message ?? 'Sign in failed' }),
      }
    )
  }

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Sign in
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email and password to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Link to="/signup" className="block">
              <Button
                type="button"
                size="lg"
                className="w-full rounded-full text-base"
              >
                Start free trial
              </Button>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
                <span className="bg-card px-2">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <ErrorBanner
                message={errors.root?.message ?? ''}
                onDismiss={() => setError('root', { message: undefined })}
              />
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <ValidationMessage message={errors.email?.message} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link
                    to="/password-reset"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <ValidationMessage message={errors.password?.message} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="login-remember"
                  className="h-4 w-4 rounded border-input"
                  {...register('remember')}
                  aria-label="Remember me"
                />
                <Label
                  htmlFor="login-remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="w-full rounded-full"
                disabled={signIn.isPending}
              >
                {signIn.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="flex flex-col gap-3">
              <SSOButton provider="google" disabled />
              <SSOButton provider="microsoft" disabled />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
