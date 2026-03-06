import { Loader2 } from 'lucide-react'

export function TokenLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-8"
      role="status"
      aria-live="polite"
      aria-label="Verifying your email, please wait"
    >
      <Loader2
        className="h-12 w-12 animate-spin text-primary"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">Verifying your email...</p>
    </div>
  )
}
