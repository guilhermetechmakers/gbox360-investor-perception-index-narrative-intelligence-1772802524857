import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import PasswordReset from '@/pages/PasswordReset'
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/about" element={<About />} />
          <Route path="/500" element={<Error500 />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies/:companyId" element={<CompanyDetail />} />
            <Route path="companies/:companyId/narratives/:narrativeId" element={<NarrativeDrillDown />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="historical" element={<HistoricalComparison />} />
          </Route>
          <Route path="/dashboard/raw-payload/:payloadId" element={<DashboardLayout />}>
            <Route index element={<RawPayloadViewer />} />
          </Route>

          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="/admin/users" element={<DashboardLayout />}>
            <Route index element={<UserManagement />} />
          </Route>
          <Route path="/admin/ingestion" element={<DashboardLayout />}>
            <Route index element={<IngestionMonitor />} />
          </Route>
          <Route path="/admin/analytics" element={<DashboardLayout />}>
            <Route index element={<Analytics />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}

export default App
