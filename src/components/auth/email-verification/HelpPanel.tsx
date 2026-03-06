import { Link } from 'react-router-dom'
import { HelpCircle, Mail } from 'lucide-react'

const SUPPORT_EMAIL = 'support@gbox360.com'

export function HelpPanel() {
  return (
    <div
      className="rounded-[20px] border border-border/40 bg-card/50 p-4 sm:rounded-[24px] sm:p-5"
      role="complementary"
      aria-label="Help and support"
    >
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">Need help?</p>
          <p className="text-muted-foreground">
            If verification keeps failing, contact our support team.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 text-primary transition-colors hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {SUPPORT_EMAIL}
          </a>
          <p className="pt-2">
            <Link
              to="/about"
              className="text-primary transition-colors hover:underline"
            >
              FAQ &amp; Glossary
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
