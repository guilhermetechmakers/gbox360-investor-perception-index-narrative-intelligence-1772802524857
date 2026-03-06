export interface SignInInput {
  email: string
  password: string
  remember?: boolean
}

export interface SignUpInput {
  email: string
  password: string
  fullName?: string
}

export interface AuthResponse {
  token?: string
  refreshToken?: string
  user: UserAuth
  needsEmailVerification?: boolean
}

export interface UserAuth {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  emailVerified?: boolean
  role: 'admin' | 'standard'
}

export interface ResetPasswordInput {
  email: string
}

export interface ConfirmPasswordResetInput {
  token: string
  newPassword: string
  confirmPassword?: string
}

export interface VerifyEmailResponse {
  success: boolean
  message: string
}

export interface VerifyTokenResponse {
  success: boolean
  status: 'verified' | 'pending' | 'expired' | 'invalid'
  message?: string
  nextSteps?: string[]
}

export interface ResendTokenResponse {
  success: boolean
  message: string
  token?: string
  expiresAt?: string
}

export interface ProfileStatusResponse {
  isComplete: boolean
  onboardingStage: string
  fieldsCompletedCount: number
}
