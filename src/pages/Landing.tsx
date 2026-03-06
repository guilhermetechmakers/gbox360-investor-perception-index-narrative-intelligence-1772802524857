import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { BarChart3, FileSearch, Shield } from 'lucide-react'

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatedPage>
          <section className="container-narrow py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Explainable narrative intelligence for investor perception
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                One auditable metric showing how market perception of a company is changing—and why.
                Traceable to raw sources, built for boards and compliance.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg">Start free trial</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="border-t border-border/40 bg-card/50 py-16">
            <div className="container-narrow">
              <h2 className="font-serif text-2xl font-semibold text-center text-foreground md:text-3xl">
                Why Gbox360
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                Narrative-first, audit-friendly signals so you can act with confidence.
              </p>
              <div className="mt-12 grid gap-8 md:grid-cols-3">
                <div className="rounded-card bg-background p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                    Investor Perception Index
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A single, transparent IPI score with breakdown: 40% Narrative, 40% Credibility, 20% Risk. Provisional weights visible in UI and exports.
                  </p>
                </div>
                <div className="rounded-card bg-background p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileSearch className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                    Drill-down to raw payloads
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Top narratives with contribution %, event lists, and direct links to preserved raw sources for audit and regulatory review.
                  </p>
                </div>
                <div className="rounded-card bg-background p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                    Board-credible & traceable
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Immutable raw payload store, exportable audit artifacts, and RBAC for enterprise access control.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="container-narrow py-16">
            <div className="rounded-card bg-card p-8 text-center shadow-card md:p-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                Ready to see why perception moved?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Sign up for a free trial. No credit card required.
              </p>
              <Link to="/signup" className="mt-6 inline-block">
                <Button size="lg">Get started</Button>
              </Link>
            </div>
          </section>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
