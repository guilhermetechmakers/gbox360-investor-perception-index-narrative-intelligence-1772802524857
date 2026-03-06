import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart3,
  FileSearch,
  Shield,
  Search,
  Calendar,
  MessageSquare,
  User,
  TrendingUp,
  Building2,
  FileText,
} from 'lucide-react'

/** Empty state for search results (no API - conversion-focused) */
const SEARCH_RESULTS: unknown[] = []

export default function Landing() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState(false)

  const results = Array.isArray(SEARCH_RESULTS) ? SEARCH_RESULTS : []
  const isEmpty = results.length === 0

  const handleSearch = useCallback(() => {
    setSearchError(false)
    setHasSearched(true)
    setSearchLoading(true)
    // Simulate brief loading (no API per spec); then show empty state
    const t = setTimeout(() => {
      setSearchLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  const handleRetry = useCallback(() => {
    setSearchError(false)
    setSearchLoading(true)
    const t = setTimeout(() => {
      setSearchLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[#F6EFE0]">
      <Navbar />
      <main className="flex-1">
        <AnimatedPage>
          <div className="mx-auto max-w-screen-xl px-4 py-8">
            {/* Hero Section */}
            <section className="mb-12 flex flex-col items-center justify-between rounded-lg bg-white p-8 shadow-lg md:flex-row">
              <div className="mb-6 flex-1 md:mb-0">
                <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl mb-4 md:mb-0">
                  Explainable narrative intelligence for investor perception
                </h1>
                <p className="font-serif text-lg text-muted-foreground md:text-xl mb-6 md:mb-0">
                  One auditable metric showing how market perception of a company is changing—and why.
                  Traceable to raw sources, built for boards and compliance.
                </p>
                <Link to="/signup" className="inline-block mt-6">
                  <Button
                    size="lg"
                    className="bg-primary text-white font-medium py-3 px-6 rounded-full hover:opacity-90 transition duration-150"
                  >
                    Start free trial
                  </Button>
                </Link>
              </div>
              <div className="w-full md:w-1/2 h-64 md:h-80 rounded-lg bg-gradient-to-br from-soft-taupe via-sage-olive to-sand-khaki object-cover flex items-center justify-center shrink-0">
                <BarChart3 className="w-24 h-24 text-primary/30" aria-hidden />
              </div>
            </section>

            {/* Search & Filter Section */}
            <section className="mb-12 rounded-lg border border-black/10 bg-white p-6 shadow-card">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                Search companies, narratives & events
              </h2>
              <p className="text-base text-muted-foreground mb-4">
                Filter by time window, source, and speaker role. Sign up to run full search.
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search companies, narratives, events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Search companies, narratives, and events"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Time window
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" /> Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground">
                    <User className="h-4 w-4" /> Speaker role
                  </span>
                </div>
                <Button
                  onClick={handleSearch}
                  className="rounded-full bg-primary text-white hover:opacity-90"
                >
                  Search
                </Button>
              </div>

              {/* Search results area: loading / error / empty */}
              <div className="mt-6 min-h-[120px] rounded-lg border border-black/10 bg-muted/20 p-4">
                {searchError ? (
                  <div className="text-center">
                    <p className="text-red-600 font-medium">Something went wrong. Please try again.</p>
                    <Button
                      onClick={handleRetry}
                      className="mt-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Retry
                    </Button>
                  </div>
                ) : searchLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full animate-pulse rounded-lg" />
                    <Skeleton className="h-5 w-full max-w-[90%] animate-pulse rounded-lg" />
                    <Skeleton className="h-5 w-full max-w-[70%] animate-pulse rounded-lg" />
                  </div>
                ) : hasSearched && isEmpty ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="h-16 w-16 text-muted-foreground mx-auto" aria-hidden>
                      <Search className="h-full w-full" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mt-4">No results yet</h3>
                    <p className="text-base text-muted-foreground text-center mt-2">
                      Sign up to search companies, narratives, and events with full filters.
                    </p>
                    <Button
                      onClick={() => navigate('/signup')}
                      className="bg-primary text-white py-2 px-4 rounded-full mt-4"
                    >
                      Start free trial
                    </Button>
                  </div>
                ) : null}
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-12 rounded-lg bg-soft-taupe p-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                Why Gbox360
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-base text-muted">
                <li>
                  <strong className="text-foreground">Investor Perception Index (IPI):</strong>{' '}
                  A single, transparent score with breakdown—40% Narrative, 40% Credibility, 20% Risk. Provisional weights visible in UI and exports.
                </li>
                <li>
                  <strong className="text-foreground">Canonical narratives:</strong>{' '}
                  Top narratives with contribution %, event lists, and direct links to preserved raw sources for audit and regulatory review.
                </li>
                <li>
                  <strong className="text-foreground">Auditability:</strong>{' '}
                  Immutable raw payload store, exportable audit artifacts, and RBAC for enterprise access control.
                </li>
              </ul>
            </section>

            {/* How It Works Section */}
            <section className="mb-12 rounded-lg bg-sage-olive p-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                How it works
              </h2>
              <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-muted">Ingest & canonicalize</p>
                  <p className="text-sm text-muted-foreground">News, social, and transcripts into NarrativeEvents</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-muted">Compute IPI</p>
                  <p className="text-sm text-muted-foreground">Time-decayed persistence, credibility, risk</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileSearch className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-muted">Drill down & export</p>
                  <p className="text-sm text-muted-foreground">Trace to raw payloads and audit artifacts</p>
                </div>
              </div>
            </section>

            {/* Use Cases Section */}
            <section className="mb-12 rounded-lg bg-sand-khaki p-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                Use cases
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="rounded-lg bg-white p-4 shadow-md transition duration-150 hover:shadow-xl">
                  <CardHeader className="p-0">
                    <Building2 className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium text-primary mb-2">Investor relations</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-base text-muted">
                      Track how perception of your company is changing and prepare evidence-based responses for boards and disclosures.
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-lg bg-white p-4 shadow-md transition duration-150 hover:shadow-xl">
                  <CardHeader className="p-0">
                    <MessageSquare className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium text-primary mb-2">Portfolio & research</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-base text-muted">
                      Explainable signals on holdings and watchlist names with drill-down to narratives and raw sources.
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-lg bg-white p-4 shadow-md transition duration-150 hover:shadow-xl">
                  <CardHeader className="p-0">
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium text-primary mb-2">Compliance & audit</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-base text-muted">
                      Immutable raw payloads and exportable audit artifacts for regulatory review and board packages.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Customer Logos / Testimonials Section */}
            <section className="mb-12 rounded-lg bg-mauve-beige p-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                Trusted by teams who need explainable signals
              </h2>
              <div className="flex flex-wrap items-center justify-around gap-8">
                <div className="flex h-12 w-24 items-center justify-center rounded bg-white/60 text-muted-foreground text-sm font-medium">
                  Institutional
                </div>
                <div className="flex h-12 w-24 items-center justify-center rounded bg-white/60 text-muted-foreground text-sm font-medium">
                  IR & C‑suite
                </div>
                <div className="flex h-12 w-24 items-center justify-center rounded bg-white/60 text-muted-foreground text-sm font-medium">
                  Sell‑side
                </div>
                <div className="flex h-12 w-24 items-center justify-center rounded bg-white/60 text-muted-foreground text-sm font-medium">
                  Data ops
                </div>
              </div>
            </section>

            {/* CTA Card */}
            <section className="mb-12">
              <Card className="rounded-lg bg-white p-8 text-center shadow-lg transition duration-150 hover:shadow-xl">
                <CardContent className="p-0">
                  <h2 className="font-serif text-2xl font-bold text-primary md:text-3xl">
                    Ready to see why perception moved?
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Sign up for a free trial. No credit card required.
                  </p>
                  <Link to="/signup" className="mt-6 inline-block">
                    <Button size="lg" className="rounded-full bg-primary text-white hover:opacity-90 transition duration-150">
                      Get started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
