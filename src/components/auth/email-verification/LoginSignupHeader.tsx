import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function LoginSignupHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-narrow flex h-14 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground transition-colors hover:text-primary"
        >
          Gbox360
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/about"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            About
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="rounded-full">
              Get started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
