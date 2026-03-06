import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white py-8">
      <div className="container-narrow">
        <p className="text-center text-base text-primary mb-4">
          Transparent pricing. Start with a free trial—upgrade when you need more seats and exports.
        </p>
        <div className="flex justify-center flex-wrap gap-6">
          <Link
            to="/about"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            About
          </Link>
          <Link
            to="/about#methodology"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            Methodology
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            Dashboard
          </Link>
          <Link
            to="/about#contact"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            Contact
          </Link>
          <Link
            to="/about#privacy"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            Privacy
          </Link>
          <Link
            to="/about#terms"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            Terms
          </Link>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gbox360. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
