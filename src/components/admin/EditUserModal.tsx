import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { useUpdateUser, useTeams } from '@/hooks/use-admin'
import type { User, Team } from '@/types/admin'

const editSchema = z.object({
  role: z.enum(['admin', 'moderator', 'support', 'viewer', 'standard']),
  status: z.enum(['active', 'inactive']),
  teamId: z.string().optional().nullable(),
})

export type EditFormValues = z.infer<typeof editSchema>

export interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
  const updateUser = useUpdateUser()
  const { data: teams = [] } = useTeams()
  const safeTeams = Array.isArray(teams) ? teams : []

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      role: 'standard',
      status: 'active',
      teamId: null,
    },
  })

  const roleValue = watch('role')
  const statusValue = watch('status')
  const teamValue = watch('teamId')

  // Sync form when user changes
  useEffect(() => {
    if (user && open) {
      const nextRole = (user.role ?? 'standard') as EditFormValues['role']
      const nextStatus = (user.status === 'active' ? 'active' : 'inactive') as 'active' | 'inactive'
      const nextTeam = user.team_id ?? null
      setValue('role', nextRole)
      setValue('status', nextStatus)
      setValue('teamId', nextTeam)
    }
  }, [user?.id, open, setValue, user?.role, user?.status, user?.team_id])

  const onSubmit = (data: EditFormValues) => {
    if (!user?.id) return
    updateUser.mutate(
      {
        userId: user.id,
        payload: {
          role: data.role,
          status: data.status,
          teamId: data.teamId ?? undefined,
        },
      },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      }
    )
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-card max-w-md"
        aria-describedby="edit-description"
        aria-labelledby="edit-title"
      >
        <DialogHeader>
          <DialogTitle id="edit-title">Edit user</DialogTitle>
          <DialogDescription id="edit-description">
            Update role, status, or team assignment for {user?.email ?? 'this user'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <p className="text-sm font-medium text-foreground">{user?.email ?? '—'}</p>
            <p className="text-xs text-muted-foreground">{user?.name ?? user?.display_name ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={roleValue}
              onValueChange={(v) => setValue('role', v as EditFormValues['role'])}
            >
              <SelectTrigger id="edit-role" className="rounded-lg">
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
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="edit-status">Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive users cannot access the platform.
              </p>
            </div>
            <Switch
              id="edit-status"
              checked={statusValue === 'active'}
              onCheckedChange={(checked) => setValue('status', checked ? 'active' : 'inactive')}
              aria-label="User active status"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-team">Team</Label>
            <Select
              value={teamValue ?? 'none'}
              onValueChange={(v) => setValue('teamId', v === 'none' ? null : v)}
            >
              <SelectTrigger id="edit-team" className="rounded-lg">
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
              disabled={updateUser.isPending}
              className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
            >
              {updateUser.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
