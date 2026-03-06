import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatedPage className="container-narrow py-12">
          <h1 className="font-serif text-3xl font-bold text-foreground">About & Help</h1>
          <p className="mt-4 text-muted-foreground">
            Methodology, FAQ, glossary, and support for the Gbox360 Investor Perception Index.
          </p>

          <section className="mt-12" id="methodology">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Methodology</h2>
            <Card className="mt-4 rounded-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  The IPI is a weighted sum of three normalized components: Narrative (40%), Credibility (40%), and Risk (20%).
                  Weights are provisional and labeled in the UI and in all exports. Narrative persistence uses
                  time-decay; credibility combines authority weighting (Analyst &gt; Media &gt; Retail) with
                  heuristic detectors. Raw payloads are preserved immutably for audit.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mt-12" id="faq">
            <h2 className="font-serif text-2xl font-semibold text-foreground">FAQ</h2>
            <ul className="mt-4 space-y-4">
              <li>
                <Card className="rounded-card">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">How is the IPI computed?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      We normalize narrative persistence, credibility proxy, and risk proxy to a common scale,
                      then apply the provisional weights (40/40/20). The formula is logged in exports.
                    </p>
                  </CardContent>
                </Card>
              </li>
              <li>
                <Card className="rounded-card">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">Can I export raw payloads?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      Yes. Full raw payload exports are available with RBAC. Audit artifacts include
                      weights, timestamps, event refs, and raw payload IDs.
                    </p>
                  </CardContent>
                </Card>
              </li>
            </ul>
          </section>

          <section className="mt-12" id="glossary">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Glossary</h2>
            <Card className="mt-4 rounded-card">
              <CardContent className="pt-6">
                <dl className="space-y-2 text-sm">
                  <dt className="font-medium text-foreground">IPI</dt>
                  <dd className="text-muted-foreground">Investor Perception Index. Single auditable metric for market perception.</dd>
                  <dt className="font-medium text-foreground">Narrative event</dt>
                  <dd className="text-muted-foreground">Canonical event from ingestion: source, speaker, raw text, topics, timestamps.</dd>
                  <dt className="font-medium text-foreground">Raw payload</dt>
                  <dd className="text-muted-foreground">Immutable stored copy of the original ingested data.</dd>
                </dl>
              </CardContent>
            </Card>
          </section>

          <section className="mt-12" id="contact">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Contact</h2>
            <Card className="mt-4 rounded-card max-w-md">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Support</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="you@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <textarea
                      id="contact-message"
                      className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Describe your issue or question."
                    />
                  </div>
                  <Button type="submit">Send</Button>
                </form>
              </CardContent>
            </Card>
          </section>

          <section className="mt-12 flex gap-4 text-sm text-muted-foreground" id="legal">
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
            <a href="#terms" className="hover:text-foreground">Terms</a>
          </section>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
