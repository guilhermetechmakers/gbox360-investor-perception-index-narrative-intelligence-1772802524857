import { Link2 } from 'lucide-react'

export function IntegrationsPlaceholderCard() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-cardPastel-sand/20 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cardPastel-cream">
        <Link2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-serif text-base font-semibold text-foreground">
        No integrations connected
      </h3>
      <p className="mt-2 max-w-sm mx-auto text-sm text-muted-foreground">
        SSO and OAuth integrations will appear here when connected. Contact your
        admin to set up enterprise SSO.
      </p>
    </div>
  )
}
