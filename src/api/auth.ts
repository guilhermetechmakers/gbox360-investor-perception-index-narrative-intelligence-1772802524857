import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type {
  AuthResponse,
  SignInInput,
  SignUpInput,
  ResetPasswordInput,
  ConfirmPasswordResetInput,
} from '@/types/auth'

const useSupabase = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function mapSupabaseUser(
  data: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null } | null
): AuthResponse | null {
  const user = data?.user ?? null
  if (!user?.id) return null
  return {
    token: '', // Supabase uses session, not Bearer token for API
    user: {
      id: user.id,
      email: user.email ?? '',
      fullName: (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string),
      emailVerified: !!user.user_metadata?.email_confirmed_at,
      role: 'standard',
    },
  }
}

export const authApi = {
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    if (useSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      if (error) throw new Error(error.message)
      const mapped = mapSupabaseUser(data)
      if (!mapped) throw new Error('Sign in failed')
      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token)
      }
      return mapped
    }
    const data = await api.post<AuthResponse>('/auth/login', credentials)
    if (data?.token) localStorage.setItem('auth_token', data.token)
    return data
  },

  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    if (useSupabase && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.fullName ? { full_name: credentials.fullName } : undefined,
        },
      })
      if (error) throw new Error(error.message)
      const mapped = mapSupabaseUser(data)
      if (!mapped) throw new Error('Sign up failed')
      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token)
      }
      return { ...mapped, needsEmailVerification: !data.user?.email_confirmed_at }
    }
    const data = await api.post<AuthResponse & { needsEmailVerification?: boolean }>(
      '/auth/register',
      credentials
    )
    if (data?.token) localStorage.setItem('auth_token', data.token)
    return data
  },

  signOut: async (): Promise<void> => {
    if (useSupabase && supabase) {
      await supabase.auth.signOut()
    } else {
      try {
        await api.post('/auth/logout', {})
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('auth_token')
  },

  resetPassword: async (input: ResetPasswordInput): Promise<void> => {
    if (useSupabase && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${window.location.origin}/password-reset`,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/forgot-password', input)
  },

  confirmPasswordReset: async (
    input: ConfirmPasswordResetInput
  ): Promise<void> => {
    if (useSupabase && supabase) {
      const { error } = await supabase.auth.updateUser({
        password: input.newPassword,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/reset-password', {
      token: input.token,
      password: input.newPassword,
    })
  },

  resendVerification: async (): Promise<void> => {
    if (useSupabase && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('No user session')
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/resend-verification', {})
  },

  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    if (useSupabase && supabase) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })
      if (error) return { success: false, message: error.message }
      return { success: true, message: 'Email verified successfully' }
    }
    const res = await api.get<{ success?: boolean; message?: string }>(
      '/auth/verify-email',
      { token }
    )
    return {
      success: res?.success ?? false,
      message: (res?.message as string) ?? 'Verification complete',
    }
  },
}
