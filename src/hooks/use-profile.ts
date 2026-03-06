/**
 * Profile hooks. Uses profileApi and authApi.
 * All state uses proper defaults: useState<T[]>([]), data ?? [].
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUser } from '@/hooks/use-auth'
import { profileApi } from '@/api/profile'
import { authApi } from '@/api/auth'
import { toast } from 'sonner'
import type {
  UserProfile,
  UpdateProfileInput,
  NotificationPreferences,
  LinkedIntegration,
  ChangePasswordInput,
  DeleteAccountInput,
} from '@/types/profile'

export const profileKeys = {
  profile: (userId: string) => ['profile', userId] as const,
  notificationPrefs: (userId: string) => ['profile', 'notification-preferences', userId] as const,
  enterpriseSeats: (userId: string) => ['profile', 'enterprise-seats', userId] as const,
  linkedIntegrations: (userId: string) => ['profile', 'linked-integrations', userId] as const,
}

function mapUserToProfile(user: { id: string; email: string; fullName?: string; emailVerified?: boolean; role?: string; organization?: string }): UserProfile {
  return {
    id: user.id,
    name: user.fullName ?? '',
    email: user.email ?? '',
    emailVerified: user.emailVerified ?? false,
    role: user.role === 'admin' ? 'admin' : 'standard',
    organization: user.organization,
    avatarUrl: undefined,
  }
}

const defaultNotificationPrefs: NotificationPreferences = {
  ingestionAlerts: true,
  ipiMovementAlerts: true,
  weeklyDigest: false,
  systemAlerts: true,
}

export function useProfile(userId: string | undefined) {
  const { data: user } = useCurrentUser()
  const effectiveId = userId ?? user?.id ?? ''

  return useQuery({
    queryKey: profileKeys.profile(effectiveId),
    queryFn: () => profileApi.getProfile(effectiveId),
    enabled: !!effectiveId,
    staleTime: 1000 * 60 * 5,
    placeholderData: user ? mapUserToProfile(user) : undefined,
  })
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileApi.updateProfile(userId, input),
    onSuccess: (updated) => {
      if (updated) queryClient.setQueryData(profileKeys.profile(userId), updated)
      toast.success('Profile updated')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to update profile')
    },
  })
}

export function useNotificationPreferences(userId: string | undefined) {
  const effectiveId = userId ?? ''

  return useQuery({
    queryKey: profileKeys.notificationPrefs(effectiveId),
    queryFn: () => profileApi.getNotificationPreferences(effectiveId),
    enabled: !!effectiveId,
    staleTime: 1000 * 60 * 5,
    placeholderData: defaultNotificationPrefs,
  })
}

export function useUpdateNotificationPreferences(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (prefs: NotificationPreferences) =>
      profileApi.updateNotificationPreferences(userId, prefs),
    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.notificationPrefs(userId) })
      const prev = queryClient.getQueryData(profileKeys.notificationPrefs(userId))
      queryClient.setQueryData(profileKeys.notificationPrefs(userId), newPrefs)
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(profileKeys.notificationPrefs(userId), ctx.prev)
      }
      toast.error('Failed to save notification preferences')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.notificationPrefs(userId) })
    },
  })
}

export function useEnterpriseSeats(userId: string | undefined) {
  const effectiveId = userId ?? ''

  return useQuery({
    queryKey: profileKeys.enterpriseSeats(effectiveId),
    queryFn: () => profileApi.getEnterpriseSeats(effectiveId),
    enabled: !!effectiveId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLinkedIntegrations(userId: string | undefined) {
  const effectiveId = userId ?? ''

  return useQuery({
    queryKey: profileKeys.linkedIntegrations(effectiveId),
    queryFn: () => profileApi.getLinkedIntegrations(effectiveId),
    enabled: !!effectiveId,
    staleTime: 1000 * 60 * 5,
    placeholderData: [] as LinkedIntegration[],
  })
}

export function useUnlinkIntegration(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (integrationId: string) => profileApi.unlinkIntegration(userId, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.linkedIntegrations(userId) })
      toast.success('Integration disconnected')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to disconnect')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => profileApi.changePassword(input),
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to change password')
    },
  })
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: () => profileApi.resendVerification(),
    onSuccess: () => {
      toast.success('Verification email sent')
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to resend')
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DeleteAccountInput) => profileApi.deleteAccount(input.password),
    onSuccess: () => {
      queryClient.clear()
      localStorage.removeItem('auth_token')
      window.location.href = '/'
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to delete account')
    },
  })
}
