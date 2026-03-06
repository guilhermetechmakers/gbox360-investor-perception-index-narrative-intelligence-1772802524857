import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container-narrow py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="font-serif text-lg font-semibold text-foreground">
              Gbox360
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Explainable narrative intelligence for investor perception.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Product</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Company</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <Link to="/about#contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Legal</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/about#privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/about#terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gbox360. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
