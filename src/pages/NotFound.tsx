import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Go to dashboard
            </Button>
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          <a href="/about#contact" className="hover:text-foreground">Contact support</a> if you need help.
        </p>
      </div>
    </AnimatedPage>
  )
}
