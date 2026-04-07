import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

export default function AuthApp() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <App />
    </ClerkProvider>
  )
}
