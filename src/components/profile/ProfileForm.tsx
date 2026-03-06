import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SectionHeader } from './SectionHeader'
import type { UserProfile, UpdateProfileInput } from '@/types/profile'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  organization: z.string().max(100).optional().or(z.literal('')),
  role: z.enum(['admin', 'standard']).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export interface ProfileFormProps {
  profile: UserProfile | null
  onSave: (input: UpdateProfileInput) => void
  isSaving?: boolean
}

export function ProfileForm({
  profile,
  onSave,
  isSaving = false,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      organization: profile?.organization ?? '',
      role: profile?.role ?? 'standard',
    },
    values: profile
      ? {
          name: profile.name ?? '',
          organization: profile.organization ?? '',
          role: profile.role ?? 'standard',
        }
      : undefined,
  })

  const onSubmit = (values: ProfileFormValues) => {
    const input: UpdateProfileInput = {
      name: values.name?.trim() || undefined,
      organization: values.organization?.trim() || undefined,
      role: values.role,
    }
    onSave(input)
  }

  const onCancel = () => {
    reset(
      profile
        ? {
            name: profile.name ?? '',
            organization: profile.organization ?? '',
            role: profile.role ?? 'standard',
          }
        : undefined
    )
  }

  return (
    <Card className="card-pastel rounded-card-lg border border-border/50 bg-card">
      <CardHeader>
        <SectionHeader
          title="Personal details"
          subtitle="Update your account information."
          helpText="Name and organization are used for audit trails and team identification."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16 rounded-full border-2 border-border">
              <AvatarImage src={profile?.avatarUrl} alt={profile?.name} />
              <AvatarFallback className="bg-cardPastel-cream text-foreground">
                {(profile?.name ?? profile?.email ?? 'U')
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-sm text-muted-foreground">
              Avatar upload coming soon. Your initials are shown for now.
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Your name"
                className="rounded-lg"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email ?? ''}
                readOnly
                disabled
                className="rounded-lg bg-muted/50"
                aria-describedby="email-readonly"
              />
              <p id="email-readonly" className="text-xs text-muted-foreground">
                {profile?.emailVerified
                  ? 'Verified. Contact support to change.'
                  : 'Verify your email to secure your account.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                {...register('organization')}
                placeholder="Your organization"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
              className="rounded-full"
            >
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
                className="rounded-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
