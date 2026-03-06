import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSignIn } from '@/hooks/use-auth'
import { AnimatedPage } from '@/components/AnimatedPage'

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

type SignInForm = z.infer<typeof signInSchema>

export default function Login() {
  const navigate = useNavigate()
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { remember: true },
  })

  const onSubmit = (data: SignInForm) => {
    signIn.mutate(
      { email: data.email, password: data.password, remember: data.remember },
      {
        onSuccess: () => navigate('/dashboard'),
        onError: (err: Error) =>
          setError('root', { message: err.message }),
      }
    )
  }

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-card shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {errors.root.message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/password-reset"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-input"
                {...register('remember')}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={signIn.isPending}>
              {signIn.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
