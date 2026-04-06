import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

let AppWrapper: React.FC

if (CLERK_KEY) {
  // Production mode with Clerk auth
  const { ClerkProvider } = await import('@clerk/clerk-react')
  AppWrapper = () => (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  )
} else {
  // Demo mode — no auth required
  console.warn('Running in DEMO MODE — no Clerk key found. Auth is bypassed.')
  const { DemoApp } = await import('./DemoApp')
  AppWrapper = () => (
    <BrowserRouter>
      <DemoApp />
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
