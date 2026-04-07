import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './lib/i18n'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const DemoApp = lazy(() => import('./DemoApp').then(m => ({ default: m.DemoApp })))
const AuthApp = lazy(() => import('./AuthApp'))

function Loading() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center">
        <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/60 mt-4 font-body text-sm">Loading ContractorOS...</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        {CLERK_KEY ? <AuthApp /> : <DemoApp />}
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
)
