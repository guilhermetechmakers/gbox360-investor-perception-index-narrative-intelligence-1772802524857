import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { usersApi } from '@/api/users'
import { toast } from 'sonner'

export const authKeys = {
  user: ['auth', 'user'] as const,
}

const useSupabase = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: usersApi.getCurrent,
    retry: false,
    staleTime: 1000 * 60 * 10,
    enabled:
      !!localStorage.getItem('auth_token') || useSupabase,
  })
}

/**
 * Session state and actions for auth.
 * Use for guarded routes and nav that depends on login state.
 */
export function useAuth() {
  const { data: user, isLoading, isError } = useCurrentUser()
  const isAuthenticated = !isError && !!user
  return {
    user: user ?? null,
    isAuthenticated,
    isLoading,
  }
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      if (data?.user) queryClient.setQueryData(authKeys.user, data.user)
      toast.success('Signed in successfully!')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Sign in failed')
    },
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      if (data?.needsEmailVerification !== false) {
        toast.success(
          'Account created! Please check your email to verify your account.'
        )
      } else {
        toast.success('Account created successfully!')
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Sign up failed')
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Signed out successfully!')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Sign out failed')
    },
  })
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Password reset failed')
    },
  })
}

export function useConfirmPasswordReset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.confirmPasswordReset,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Password reset successfully! You can now sign in.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Password reset failed')
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent.')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to resend')
    },
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      if (data?.success) toast.success(data.message ?? 'Email verified!')
      else toast.error(data?.message ?? 'Verification failed')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Verification failed')
    },
  })
}
