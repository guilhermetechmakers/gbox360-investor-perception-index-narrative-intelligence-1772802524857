import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePasswordReset } from '@/hooks/use-auth'
import { AnimatedPage } from '@/components/AnimatedPage'

const schema = z.object({
  email: z.string().email('Invalid email'),
})

type Form = z.infer<typeof schema>

export default function PasswordReset() {
  const reset = usePasswordReset()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = (data: Form) => {
    reset.mutate({ email: data.email })
  }

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-card shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={reset.isPending}>
              {reset.isPending ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          <Link
            to="/login"
            className="mt-4 block text-center text-sm text-muted-foreground hover:text-primary"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
