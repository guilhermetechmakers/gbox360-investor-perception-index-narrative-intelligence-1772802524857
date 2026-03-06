import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader } from './SectionHeader'
import { IntegrationsPlaceholderCard } from './IntegrationsPlaceholderCard'
import { Link2, Unlink } from 'lucide-react'
import type { LinkedIntegration } from '@/types/profile'

export interface LinkedIntegrationsPanelProps {
  integrations: LinkedIntegration[]
  onUnlink: (integrationId: string) => void
  isUnlinking?: boolean
}

export function LinkedIntegrationsPanel({
  integrations,
  onUnlink,
  isUnlinking = false,
}: LinkedIntegrationsPanelProps) {
  const items = integrations ?? []
  const hasItems = Array.isArray(items) && items.length > 0

  return (
    <Card className="card-pastel rounded-card-lg border border-border/50 bg-card">
      <CardHeader>
        <SectionHeader
          title="Linked integrations"
          subtitle="SSO, OAuth, and data connectors."
          helpText="Connect SSO providers and OAuth apps. Disconnect to revoke access."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {hasItems ? (
          <ul className="space-y-3">
            {items.map((integration) => (
              <li
                key={integration.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cardPastel-cream">
                    <Link2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {integration.provider}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Connected{' '}
                      {integration.connectedAt
                        ? new Date(integration.connectedAt).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUnlink(integration.id)}
                  disabled={isUnlinking}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Disconnect ${integration.provider}`}
                >
                  <Unlink className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <IntegrationsPlaceholderCard />
        )}
      </CardContent>
    </Card>
  )
}
