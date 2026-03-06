import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export interface ProtectedRouteProps {
  children: React.ReactNode
  /** Redirect here when not authenticated; default /login */
  loginPath?: string
}

/**
 * Wraps content that requires authentication.
 * Redirects to login (with return URL in state) when not authenticated.
 */
export function ProtectedRoute({ children, loginPath = '/login' }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  return <>{children}</>
}
