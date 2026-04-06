import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toaster } from '@/components/Toaster'
import { Dashboard } from '@/pages/Dashboard'
import { ProposalList } from '@/pages/ProposalList'
import { NewProposal } from '@/pages/NewProposal'
import { ProposalPreview } from '@/pages/ProposalPreview'
import { ClientPortal } from '@/pages/ClientPortal'
import { Onboarding } from '@/pages/Onboarding'
import { SettingsPage } from '@/pages/Settings'

function AuthenticatedRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proposals" element={<ProposalList />} />
        <Route path="/proposals/new" element={<NewProposal />} />
        <Route path="/proposals/:id" element={<ProposalPreview />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/p/:id" element={<ClientPortal />} />
        <Route
          path="/sign-in/*"
          element={
            <div className="min-h-screen bg-navy flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-heading font-bold text-white">ContractorOS</h1>
                  <p className="text-white/60 mt-2">The only business tool you'll ever need</p>
                </div>
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
              </div>
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="min-h-screen bg-navy flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-heading font-bold text-white">ContractorOS</h1>
                  <p className="text-white/60 mt-2">Start your 14-day free trial</p>
                </div>
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
              </div>
            </div>
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <AuthenticatedRoutes />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}
