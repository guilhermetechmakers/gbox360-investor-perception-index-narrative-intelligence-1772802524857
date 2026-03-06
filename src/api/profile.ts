/**
 * Profile API - User profile, notification preferences, enterprise seats, linked integrations.
 * API-ready for backend integration. Uses standardized REST endpoints.
 */

import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type {
  UserProfile,
  UpdateProfileInput,
  NotificationPreferences,
  EnterpriseSeats,
  LinkedIntegration,
  ChangePasswordInput,
  DeleteAccountInput,
} from '@/types/profile'
import type { User } from '@/types/user'

const useSupabase = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function mapUserToProfile(user: User | null): UserProfile | null {
  if (!user?.id) return null
  return {
    id: user.id,
    name: user.fullName ?? '',
    email: user.email ?? '',
    emailVerified: user.emailVerified ?? false,
    role: user.role ?? 'standard',
    organization: user.organization,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt ?? new Date().toISOString(),
    updatedAt: user.updatedAt ?? new Date().toISOString(),
  }
}

const defaultNotificationPrefs: NotificationPreferences = {
  ingestionAlerts: true,
  ipiMovementAlerts: true,
  weeklyDigest: false,
  systemAlerts: true,
}

export const profileApi = {
  /** GET /api/profile/:userId - Fetch user profile */
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    if (useSupabase && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null
      return mapUserToProfile({
        id: user.id,
        email: user.email ?? '',
        fullName: (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string),
        emailVerified: !!user.email_confirmed_at,
        role: (user.user_metadata?.role as 'admin' | 'standard') ?? 'standard',
        organization: user.user_metadata?.organization as string | undefined,
        avatarUrl: user.user_metadata?.avatar_url as string | undefined,
        createdAt: user.created_at ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    try {
      const data = await api.get<UserProfile | { profile?: UserProfile }>(
        `/profile/${userId}`
      )
      return (data as { profile?: UserProfile })?.profile ?? (data as UserProfile) ?? null
    } catch {
      return null
    }
  },

  /** PUT /api/profile/:userId - Update profile fields */
  updateProfile: async (
    userId: string,
    updates: UpdateProfileInput
  ): Promise<UserProfile> => {
    if (useSupabase && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          organization: updates.organization,
          role: updates.role,
          avatar_url: updates.avatarUrl,
        },
      })
      if (error) throw new Error(error.message)
      const user = data?.user
      if (!user) throw new Error('Update failed')
      return mapUserToProfile({
        id: user.id,
        email: user.email ?? '',
        fullName: (user.user_metadata?.full_name as string) ?? updates.name,
        emailVerified: !!user.email_confirmed_at,
        role: (user.user_metadata?.role as 'admin' | 'standard') ?? updates.role ?? 'standard',
        organization: (user.user_metadata?.organization as string) ?? updates.organization,
        avatarUrl: (user.user_metadata?.avatar_url as string) ?? updates.avatarUrl,
        createdAt: user.created_at ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })!
    }
    const data = await api.put<UserProfile>(`/profile/${userId}`, updates)
    return data
  },

  /** GET /api/profile/notification-preferences/:userId */
  getNotificationPreferences: async (
    userId: string
  ): Promise<NotificationPreferences> => {
    try {
      const data = await api.get<NotificationPreferences | { data?: NotificationPreferences }>(
        `/profile/notification-preferences/${userId}`
      )
      const prefs = (data as { data?: NotificationPreferences })?.data ?? (data as NotificationPreferences)
      return prefs ?? defaultNotificationPrefs
    } catch {
      return defaultNotificationPrefs
    }
  },

  /** PUT /api/profile/notification-preferences/:userId */
  updateNotificationPreferences: async (
    userId: string,
    prefs: NotificationPreferences
  ): Promise<NotificationPreferences> => {
    try {
      const data = await api.put<NotificationPreferences | { data?: NotificationPreferences }>(
        `/profile/notification-preferences/${userId}`,
        prefs
      )
      return (data as { data?: NotificationPreferences })?.data ?? (data as NotificationPreferences) ?? prefs
    } catch {
      throw new Error('Failed to save notification preferences')
    }
  },

  /** GET /api/profile/enterprise-seats/:userId - Returns null if not enterprise */
  getEnterpriseSeats: async (userId: string): Promise<EnterpriseSeats | null> => {
    try {
      const data = await api.get<EnterpriseSeats | { data?: EnterpriseSeats } | null>(
        `/profile/enterprise-seats/${userId}`
      )
      if (!data) return null
      const seats = (data as { data?: EnterpriseSeats })?.data ?? (data as EnterpriseSeats)
      return seats ?? null
    } catch {
      return null
    }
  },

  /** GET /api/profile/linked-integrations/:userId */
  getLinkedIntegrations: async (userId: string): Promise<LinkedIntegration[]> => {
    try {
      const data = await api.get<LinkedIntegration[] | { data?: LinkedIntegration[] }>(
        `/profile/linked-integrations/${userId}`
      )
      const list = Array.isArray(data) ? data : (data as { data?: LinkedIntegration[] })?.data
      return list ?? []
    } catch {
      return []
    }
  },

  /** DELETE /api/profile/linked-integrations/:userId/:integrationId */
  unlinkIntegration: async (
    userId: string,
    integrationId: string
  ): Promise<void> => {
    await api.delete(`/profile/linked-integrations/${userId}/${integrationId}`)
  },

  /** POST /api/auth/change-password */
  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    if (useSupabase && supabase) {
      const { error } = await supabase.auth.updateUser({
        password: input.newPassword,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/change-password', input)
  },

  /** POST /api/auth/verify-email - Resend verification email */
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
    await api.post('/auth/verify-email', {})
  },

  /** POST /api/auth/delete-account - Delete account (placeholder) */
  deleteAccount: async (input: DeleteAccountInput): Promise<void> => {
    if (useSupabase && supabase) {
      const { error } = await supabase.rpc('delete_user', {
        password: input?.password,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/delete-account', { password: input?.password })
  },

  /** POST /api/auth/logout-all */
  logoutAll: async (): Promise<void> => {
    if (useSupabase && supabase) {
      await supabase.auth.signOut()
    } else {
      try {
        await api.post('/auth/logout-all', {})
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('auth_token')
  },
}
