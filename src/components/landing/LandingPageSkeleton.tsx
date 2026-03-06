import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

/**
 * Skeleton matching the landing page layout structure.
 * Use as fallback for Suspense or when loading landing content.
 */
export function LandingPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6EFE0]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          {/* Hero */}
          <div className="mb-12 flex flex-col rounded-lg bg-white p-8 shadow-lg md:flex-row md:items-center">
            <div className="mb-6 flex-1 md:mb-0">
              <Skeleton className="mb-4 h-12 w-full max-w-xl animate-pulse rounded-lg" />
              <Skeleton className="mb-6 h-6 w-3/4 max-w-md animate-pulse rounded-lg" />
              <Skeleton className="h-12 w-40 animate-pulse rounded-full" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg md:h-80 md:w-1/2" />
          </div>

          {/* Search */}
          <div className="mb-12 rounded-lg border border-black/10 bg-white p-6">
            <Skeleton className="mb-4 h-8 w-64 animate-pulse rounded-lg" />
            <Skeleton className="mb-4 h-4 w-full animate-pulse rounded-lg" />
            <Skeleton className="mb-4 h-10 w-full animate-pulse rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 animate-pulse rounded-lg" />
              <Skeleton className="h-9 w-20 animate-pulse rounded-lg" />
              <Skeleton className="h-9 w-20 animate-pulse rounded-lg" />
            </div>
            <div className="mt-6 space-y-3 rounded-lg border border-black/10 bg-muted/20 p-4">
              <Skeleton className="h-5 w-full animate-pulse rounded-lg" />
              <Skeleton className="h-5 w-[90%] animate-pulse rounded-lg" />
              <Skeleton className="h-5 w-[70%] animate-pulse rounded-lg" />
            </div>
          </div>

          {/* Features */}
          <div className="mb-12 rounded-lg bg-soft-taupe p-8">
            <Skeleton className="mb-4 h-8 w-48 animate-pulse rounded-lg" />
            <ul className="space-y-2">
              <Skeleton className="h-5 w-full animate-pulse rounded-lg" />
              <Skeleton className="h-5 w-full animate-pulse rounded-lg" />
              <Skeleton className="h-5 w-4/5 animate-pulse rounded-lg" />
            </ul>
          </div>

          {/* How it works */}
          <div className="mb-12 rounded-lg bg-sage-olive p-8">
            <Skeleton className="mb-6 h-8 w-40 animate-pulse rounded-lg" />
            <div className="flex flex-col gap-4 md:flex-row">
              <Skeleton className="h-24 flex-1 animate-pulse rounded-lg" />
              <Skeleton className="h-24 flex-1 animate-pulse rounded-lg" />
              <Skeleton className="h-24 flex-1 animate-pulse rounded-lg" />
            </div>
          </div>

          {/* Use cases */}
          <div className="mb-12 rounded-lg bg-sand-khaki p-8">
            <Skeleton className="mb-4 h-8 w-32 animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Skeleton className="h-36 animate-pulse rounded-lg" />
              <Skeleton className="h-36 animate-pulse rounded-lg" />
              <Skeleton className="h-36 animate-pulse rounded-lg" />
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12 rounded-lg bg-mauve-beige p-8">
            <Skeleton className="mb-6 h-8 w-72 animate-pulse rounded-lg" />
            <div className="flex justify-around gap-4">
              <Skeleton className="h-12 w-24 animate-pulse rounded" />
              <Skeleton className="h-12 w-24 animate-pulse rounded" />
              <Skeleton className="h-12 w-24 animate-pulse rounded" />
            </div>
          </div>

          {/* CTA */}
          <Skeleton className="h-40 w-full animate-pulse rounded-lg" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
