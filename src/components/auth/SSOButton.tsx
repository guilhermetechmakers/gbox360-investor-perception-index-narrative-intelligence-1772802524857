import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

export type SSOProvider = 'google' | 'microsoft'

export interface SSOButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: SSOProvider
  disabled?: boolean
  className?: string
}

const providerConfig: Record<
  SSOProvider,
  { label: string; icon: string; ariaLabel: string }
> = {
  google: {
    label: 'Continue with Google',
    icon: 'G',
    ariaLabel: 'Sign in with Google',
  },
  microsoft: {
    label: 'Continue with Microsoft',
    icon: 'M',
    ariaLabel: 'Sign in with Microsoft',
  },
}

export function SSOButton({
  provider,
  disabled = false,
  className,
  ...props
}: SSOButtonProps) {
  const config = providerConfig[provider]
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'w-full border border-border bg-card text-foreground hover:bg-accent/50 hover:text-accent-foreground',
        className
      )}
      disabled={disabled}
      aria-label={config.ariaLabel}
      {...props}
    >
      <span
        className="mr-2 flex h-5 w-5 items-center justify-center rounded border border-current text-xs font-semibold"
        aria-hidden
      >
        {config.icon}
      </span>
      {config.label}
    </Button>
  )
}
