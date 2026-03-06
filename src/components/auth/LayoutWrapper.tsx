import { AuthLayout, AuthLayoutCard } from './AuthLayout'
import { cn } from '@/lib/utils'

/**
 * Layout wrapper for auth flows (e.g. password reset).
 * Provides consistent card-based layout, grid, and responsive spacing per design system.
 */
export interface LayoutWrapperProps {
  children: React.ReactNode
  className?: string
  /** Centered card-style content; default true */
  centered?: boolean
}

export function LayoutWrapper({
  children,
  className,
  centered = true,
}: LayoutWrapperProps) {
  return (
    <AuthLayout centered={centered}>
      <AuthLayoutCard className={cn('border border-black/5', className)}>
        {children}
      </AuthLayoutCard>
    </AuthLayout>
  )
}
