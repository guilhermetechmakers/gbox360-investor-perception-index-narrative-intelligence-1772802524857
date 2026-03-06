import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { cn } from '@/lib/utils'

export interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
  /** Centered card-style content; default true */
  centered?: boolean
}

export function AuthLayout({
  children,
  className,
  centered = true,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main
        className={cn(
          'flex-1',
          centered && 'flex items-center justify-center px-4 py-12',
          className
        )}
      >
        <AnimatedPage
          className={cn(
            'w-full max-w-[1200px]',
            centered && 'flex items-center justify-center'
          )}
        >
          {children}
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}

export function AuthLayoutCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'w-full max-w-md rounded-[20px] bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover sm:rounded-[28px] sm:p-8',
        className
      )}
    >
      {children}
    </div>
  )
}
