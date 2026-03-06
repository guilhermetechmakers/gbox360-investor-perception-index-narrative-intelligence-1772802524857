import { useState } from 'react'
import { useCurrentUser } from '@/hooks/use-auth'
import {
  useProfile,
  useUpdateProfile,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useEnterpriseSeats,
  useLinkedIntegrations,
  useUnlinkIntegration,
  useChangePassword,
  useResendVerificationEmail,
  useDeleteAccount,
} from '@/hooks/use-profile'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ProfileForm,
  NotificationPreferencesPanel,
  EnterpriseSeatsPanel,
  LinkedIntegrationsPanel,
  SecurityPanel,
  EmailVerificationBanner,
  PasswordManagementModal,
  DeleteAccountModal,
} from '@/components/profile'
const defaultNotificationPrefs = {
  ingestionAlerts: true,
  ipiMovementAlerts: true,
  weeklyDigest: false,
  systemAlerts: true,
}

export default function Profile() {
  const { data: user } = useCurrentUser()
  const userId = user?.id ?? ''

  const { data: profile, isLoading: profileLoading } = useProfile(userId)
  const { data: notificationPrefs = defaultNotificationPrefs } =
    useNotificationPreferences(userId)
  const { data: enterpriseSeats } = useEnterpriseSeats(userId)
  const { data: linkedIntegrations = [] } = useLinkedIntegrations(userId)

  const updateProfile = useUpdateProfile(userId)
  const updateNotificationPrefs = useUpdateNotificationPreferences(userId)
  const unlinkIntegration = useUnlinkIntegration(userId)
  const changePassword = useChangePassword()
  const resendVerification = useResendVerificationEmail()
  const deleteAccount = useDeleteAccount()

  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const effectiveProfile = profile ?? null
  const integrations = Array.isArray(linkedIntegrations) ? linkedIntegrations : []
  const isEnterprise = enterpriseSeats != null

  if (profileLoading && !effectiveProfile) {
    return (
      <AnimatedPage>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-card" />
          <Skeleton className="h-48 w-full rounded-card" />
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Profile
      </h1>

      {effectiveProfile && !effectiveProfile.emailVerified && (
        <EmailVerificationBanner
          onResendVerification={() => resendVerification.mutate(undefined)}
          isResending={resendVerification.isPending}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm
          profile={effectiveProfile}
          onSave={(updates) => updateProfile.mutate(updates)}
          isSaving={updateProfile.isPending}
        />

        <NotificationPreferencesPanel
          preferences={notificationPrefs}
          onSave={(prefs) => updateNotificationPrefs.mutate(prefs)}
          isSaving={updateNotificationPrefs.isPending}
        />
      </div>

      {isEnterprise && enterpriseSeats && (
        <div className="max-w-xl">
          <EnterpriseSeatsPanel seats={enterpriseSeats} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <LinkedIntegrationsPanel
          integrations={integrations}
          onUnlink={(id) => unlinkIntegration.mutate(id)}
          isUnlinking={unlinkIntegration.isPending}
        />

        <SecurityPanel
          onChangePassword={() => setPasswordModalOpen(true)}
          onDeleteAccount={() => setDeleteModalOpen(true)}
        />
      </div>

      <PasswordManagementModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        onSubmit={async (currentPassword, newPassword) => {
          await changePassword.mutateAsync({
            currentPassword,
            newPassword,
            confirmPassword: newPassword,
          })
        }}
        isLoading={changePassword.isPending}
      />

      <DeleteAccountModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={async (password) => {
          await deleteAccount.mutateAsync({
            password: password ?? '',
            confirmation: 'delete my account',
          })
          setDeleteModalOpen(false)
        }}
        isLoading={deleteAccount.isPending}
      />
    </AnimatedPage>
  )
}
