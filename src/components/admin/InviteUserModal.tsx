import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInviteUser, useTeams } from '@/hooks/use-admin'
import type { Team } from '@/types/admin'

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'moderator', 'support', 'viewer', 'standard']),
  teamId: z.string().optional().nullable(),
  notes: z.string().max(500).optional(),
})

export type InviteFormValues = z.infer<typeof inviteSchema>

export interface InviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserModal({ open, onOpenChange }: InviteUserModalProps) {
  const inviteUser = useInviteUser()
  const { data: teams = [] } = useTeams()
  const safeTeams = Array.isArray(teams) ? teams : []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'standard',
      teamId: null,
      notes: '',
    },
  })

  const roleValue = watch('role')
  const teamValue = watch('teamId')

  const onSubmit = (data: InviteFormValues) => {
    inviteUser.mutate(
      {
        email: data.email,
        role: data.role,
        teamId: data.teamId ?? undefined,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-card max-w-md"
        aria-describedby="invite-description"
        aria-labelledby="invite-title"
      >
        <DialogHeader>
          <DialogTitle id="invite-title">Invite user</DialogTitle>
          <DialogDescription id="invite-description">
            Send an invitation to join the platform. They will receive an email with signup instructions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'invite-email-error' : undefined}
              className="rounded-lg"
              {...register('email')}
            />
            {errors.email && (
              <p id="invite-email-error" className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              value={roleValue ?? 'standard'}
              onValueChange={(v) => setValue('role', v as InviteFormValues['role'])}
            >
              <SelectTrigger id="invite-role" className="rounded-lg">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-team">Team</Label>
            <Select
              value={teamValue ?? 'none'}
              onValueChange={(v) => setValue('teamId', v === 'none' ? null : v)}
            >
              <SelectTrigger id="invite-team" className="rounded-lg">
                <SelectValue placeholder="Select team (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No team</SelectItem>
                {(safeTeams as Team[]).map((t) => (
                  <SelectItem key={t?.id ?? ''} value={t?.id ?? ''}>
                    {t?.name ?? '—'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-notes">Notes (optional)</Label>
            <Input
              id="invite-notes"
              type="text"
              placeholder="Internal notes about this invite"
              maxLength={500}
              className="rounded-lg"
              {...register('notes')}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={inviteUser.isPending}
              className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
            >
              {inviteUser.isPending ? 'Sending...' : 'Send invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
