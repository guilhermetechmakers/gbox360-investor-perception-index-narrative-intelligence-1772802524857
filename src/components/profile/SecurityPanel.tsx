import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { SectionHeader } from './SectionHeader'
import { KeyRound, Shield } from 'lucide-react'

export interface SecurityPanelProps {
  onChangePassword: () => void
  onDeleteAccount: () => void
}

export function SecurityPanel({
  onChangePassword,
  onDeleteAccount,
}: SecurityPanelProps) {
  return (
    <Card className="card-pastel rounded-card-lg border border-border/50 bg-card">
      <CardHeader>
        <SectionHeader
          title="Security"
          subtitle="Password and account actions."
          helpText="Change your password regularly. Two-factor authentication coming soon."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Password</p>
                <p className="text-xs text-muted-foreground">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onChangePassword}
              className="rounded-full"
            >
              Change password
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4 opacity-75">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">
                  Coming soon. Add an extra layer of security.
                </p>
              </div>
            </div>
            <Switch disabled aria-label="2FA (coming soon)" />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <Button
            variant="destructive"
            onClick={onDeleteAccount}
            className="rounded-full"
          >
            Delete account
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
