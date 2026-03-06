import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { SectionHeader } from './SectionHeader'
import type { NotificationPreferences } from '@/types/profile'

export interface NotificationPreferencesPanelProps {
  preferences: NotificationPreferences
  onSave: (prefs: NotificationPreferences) => void
  isSaving?: boolean
}

export function NotificationPreferencesPanel({
  preferences,
  onSave,
  isSaving = false,
}: NotificationPreferencesPanelProps) {
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>({
    ingestionAlerts: preferences?.ingestionAlerts ?? true,
    ipiMovementAlerts: preferences?.ipiMovementAlerts ?? true,
    weeklyDigest: preferences?.weeklyDigest ?? false,
    systemAlerts: preferences?.systemAlerts ?? true,
  })

  useEffect(() => {
    setLocalPrefs({
      ingestionAlerts: preferences?.ingestionAlerts ?? true,
      ipiMovementAlerts: preferences?.ipiMovementAlerts ?? true,
      weeklyDigest: preferences?.weeklyDigest ?? false,
      systemAlerts: preferences?.systemAlerts ?? true,
    })
  }, [
    preferences?.ingestionAlerts,
    preferences?.ipiMovementAlerts,
    preferences?.weeklyDigest,
    preferences?.systemAlerts,
  ])

  const hasChanges =
    localPrefs.ingestionAlerts !== (preferences?.ingestionAlerts ?? true) ||
    localPrefs.ipiMovementAlerts !== (preferences?.ipiMovementAlerts ?? true) ||
    localPrefs.weeklyDigest !== (preferences?.weeklyDigest ?? false) ||
    localPrefs.systemAlerts !== (preferences?.systemAlerts ?? true)

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(localPrefs)
  }

  return (
    <Card className="card-pastel rounded-card-lg border border-border/50 bg-card">
      <CardHeader>
        <SectionHeader
          title="Notification preferences"
          subtitle="Choose how you receive updates."
          helpText="Control ingestion alerts, IPI movement notifications, and digest emails."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="ingestion-alerts" className="text-sm font-medium">
                Ingestion alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Get notified when data ingestion fails or completes.
              </p>
            </div>
            <Switch
              id="ingestion-alerts"
              checked={localPrefs.ingestionAlerts}
              onCheckedChange={(v) => handleToggle('ingestionAlerts', !!v)}
              aria-label="Toggle ingestion alerts"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="ipi-alerts" className="text-sm font-medium">
                IPI movement alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Alerts when significant IPI changes occur for watched companies.
              </p>
            </div>
            <Switch
              id="ipi-alerts"
              checked={localPrefs.ipiMovementAlerts}
              onCheckedChange={(v) => handleToggle('ipiMovementAlerts', !!v)}
              aria-label="Toggle IPI movement alerts"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest" className="text-sm font-medium">
                Weekly digest
              </Label>
              <p className="text-xs text-muted-foreground">
                Summary of top narratives and IPI changes each week.
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={localPrefs.weeklyDigest}
              onCheckedChange={(v) => handleToggle('weeklyDigest', !!v)}
              aria-label="Toggle weekly digest"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="system-alerts" className="text-sm font-medium">
                System alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Important platform and security notifications.
              </p>
            </div>
            <Switch
              id="system-alerts"
              checked={localPrefs.systemAlerts ?? true}
              onCheckedChange={(v) => handleToggle('systemAlerts', !!v)}
              aria-label="Toggle system alerts"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="rounded-full"
        >
          {isSaving ? 'Saving…' : 'Save preferences'}
        </Button>
      </CardContent>
    </Card>
  )
}
