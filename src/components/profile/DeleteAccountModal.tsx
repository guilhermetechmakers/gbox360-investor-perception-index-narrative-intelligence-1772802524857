import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
const CONFIRMATION_TEXT = 'delete my account'

export interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (password?: string) => void | Promise<void>
  isLoading?: boolean
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmation.toLowerCase().trim() === CONFIRMATION_TEXT

  const handleClose = () => {
    setPassword('')
    setConfirmation('')
    setError(null)
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    setError(null)
    if (!isConfirmed) {
      setError(`Please type "${CONFIRMATION_TEXT}" to confirm.`)
      return
    }
    try {
      await onConfirm(password || undefined)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Delete account
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All your data, including audit trails
            and saved preferences, will be permanently deleted. Type{' '}
            <strong>{CONFIRMATION_TEXT}</strong> below to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="delete-confirmation" className="text-foreground">
              Confirmation
            </Label>
            <Input
              id="delete-confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={CONFIRMATION_TEXT}
              className="rounded-lg"
              aria-invalid={!isConfirmed && confirmation.length > 0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delete-password" className="text-foreground">
              Your password (optional)
            </Label>
            <Input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password if required"
              className="rounded-lg"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={!isConfirmed || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting…' : 'Delete account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
