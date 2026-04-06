import { Routes, Route, Navigate } from 'react-router-dom'
import { DemoLayout } from '@/components/layout/DemoLayout'
import { Toaster } from '@/components/Toaster'
import { LandingPage } from '@/pages/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { ProposalList } from '@/pages/ProposalList'
import { NewProposal } from '@/pages/NewProposal'
import { ProposalPreview } from '@/pages/ProposalPreview'
import { ClientPortal } from '@/pages/ClientPortal'
import { Onboarding } from '@/pages/Onboarding'
import { SettingsPage } from '@/pages/Settings'

export function DemoApp() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<Navigate to="/dashboard" replace />} />
        <Route path="/sign-up" element={<Navigate to="/onboarding" replace />} />
        <Route path="/p/:id" element={<ClientPortal />} />

        {/* App routes (with sidebar) */}
        <Route
          path="/*"
          element={
            <DemoLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/proposals" element={<ProposalList />} />
                <Route path="/proposals/new" element={<NewProposal />} />
                <Route path="/proposals/:id" element={<ProposalPreview />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </DemoLayout>
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}
