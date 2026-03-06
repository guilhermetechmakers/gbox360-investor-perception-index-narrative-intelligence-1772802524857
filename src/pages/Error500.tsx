import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Home, RefreshCw } from 'lucide-react'

export default function Error500() {
  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-foreground">500</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Something went wrong on our end. We’re working to fix it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Link to="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          <a href="/about#contact" className="hover:text-foreground">Contact support</a> if the problem persists.
        </p>
      </div>
    </AnimatedPage>
  )
}
