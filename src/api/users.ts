import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { User, UpdateUserInput } from '@/types/user'
import type { ProfileStatusResponse } from '@/types/auth'

const useSupabase = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function mapSupabaseUserToUser(
  data: {
    id: string
    email?: string
    user_metadata?: Record<string, unknown>
    created_at?: string
    email_confirmed_at?: string | null
  } | null
): User | null {
  if (!data?.id) return null
  return {
    id: data.id,
    email: data.email ?? '',
    fullName: (data.user_metadata?.full_name as string) ?? (data.user_metadata?.name as string),
    emailVerified: !!data.email_confirmed_at,
    role: (data.user_metadata?.role as 'admin' | 'standard') ?? 'standard',
    createdAt: data.created_at ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const usersApi = {
  getCurrent: async (): Promise<User> => {
    if (useSupabase && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw new Error(error.message)
      const mapped = mapSupabaseUserToUser(user)
      if (!mapped) throw new Error('Not authenticated')
      return mapped
    }
    return api.get<User>('/users/me')
  },
  updateProfile: async (updates: UpdateUserInput): Promise<User> =>
    api.put<User>(`/users/${updates.id}`, updates),
  getAll: async (): Promise<User[]> => {
    const data = await api.get<User[] | { data?: User[] }>('/users')
    return Array.isArray(data) ? data : (data?.data ?? [])
  },
  getById: async (id: string): Promise<User> =>
    api.get<User>(`/users/${id}`),

  getProfileStatus: async (userId?: string): Promise<ProfileStatusResponse> => {
    if (useSupabase && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return {
          isComplete: false,
          onboardingStage: 'signup',
          fieldsCompletedCount: 0,
        }
      }
      const hasEmail = !!user.email
      const hasName = !!(
        (user.user_metadata?.full_name as string) ??
        (user.user_metadata?.name as string)
      )
      const fieldsCompletedCount = [hasEmail, hasName].filter(Boolean).length
      return {
        isComplete: hasEmail && hasName,
        onboardingStage: hasEmail && hasName ? 'complete' : 'profile',
        fieldsCompletedCount,
      }
    }
    const params = userId ? { userId } : undefined
    const res = await api.get<ProfileStatusResponse>(
      '/user/profile-status',
      params as Record<string, string> | undefined
    )
    return res
  },
}
