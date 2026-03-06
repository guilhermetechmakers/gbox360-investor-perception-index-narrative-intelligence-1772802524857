import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { ProtectedRoute } from '@/components/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import PasswordResetRequestPage from '@/pages/PasswordResetRequestPage'
import PasswordResetConfirmPage from '@/pages/PasswordResetConfirmPage'
import EmailVerification from '@/pages/EmailVerification'
import Dashboard from '@/pages/Dashboard'
import CompanyDetail from '@/pages/CompanyDetail'
import NarrativeDrillDown from '@/pages/NarrativeDrillDown'
import RawPayloadViewer from '@/pages/RawPayloadViewer'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import AdminDashboard from '@/pages/AdminDashboard'
import UserManagement from '@/pages/UserManagement'
import IngestionMonitor from '@/pages/IngestionMonitor'
import Analytics from '@/pages/Analytics'
import HistoricalComparison from '@/pages/HistoricalComparison'
import Checkout from '@/pages/Checkout'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import Error500 from '@/pages/Error500'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordResetRequestPage />} />
          <Route path="/reset-password" element={<PasswordResetConfirmPage />} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/about" element={<About />} />
          <Route path="/500" element={<Error500 />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="companies/:companyId" element={<CompanyDetail />} />
            <Route path="companies/:companyId/narratives/:narrativeId" element={<NarrativeDrillDown />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="historical" element={<HistoricalComparison />} />
          </Route>
          <Route path="/dashboard/raw-payload/:payloadId" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<RawPayloadViewer />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="/admin/users" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<UserManagement />} />
          </Route>
          <Route path="/admin/ingestion" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<IngestionMonitor />} />
          </Route>
          <Route path="/admin/analytics" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Analytics />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
