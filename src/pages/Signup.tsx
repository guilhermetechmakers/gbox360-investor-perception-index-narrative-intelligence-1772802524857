import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSignUp } from '@/hooks/use-auth'
import { AnimatedPage } from '@/components/AnimatedPage'

const signUpSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    fullName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignUpForm = z.infer<typeof signUpSchema>

export default function Signup() {
  const navigate = useNavigate()
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = (data: SignUpForm) => {
    signUp.mutate(
      { email: data.email, password: data.password, fullName: data.fullName },
      {
        onSuccess: () => navigate('/email-verification'),
        onError: (err: Error) =>
          setError('root', { message: err.message }),
      }
    )
  }

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-card shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Create account</CardTitle>
          <CardDescription>
            Start your free trial. We&apos;ll send a verification email.
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
              <Label htmlFor="fullName">Full name (optional)</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                {...register('fullName')}
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={signUp.isPending}>
              {signUp.isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
