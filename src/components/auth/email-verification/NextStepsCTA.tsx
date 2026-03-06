import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, User } from 'lucide-react'

export interface NextStepsCTAProps {
  isProfileComplete: boolean
  nextSteps?: string[]
}

export function NextStepsCTA({ isProfileComplete, nextSteps = [] }: NextStepsCTAProps) {
  const steps = Array.isArray(nextSteps) ? nextSteps : []
  const showCompleteProfile = !isProfileComplete || steps.includes('profile')

  return (
    <div className="space-y-4" role="group" aria-label="Next steps">
      <p className="text-sm font-medium text-muted-foreground">What would you like to do next?</p>
      <div className="flex flex-col gap-3">
        <Link to="/dashboard" className="block">
          <Button
            size="lg"
            className="w-full rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
        </Link>
        {showCompleteProfile && (
          <Link to="/dashboard/profile" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              <User className="mr-2 h-4 w-4" aria-hidden />
              Complete Profile
            </Button>
          </Link>
        )}
        <Link
          to="/about"
          className="block text-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Learn about IPI methodology
        </Link>
      </div>
    </div>
  )
}
