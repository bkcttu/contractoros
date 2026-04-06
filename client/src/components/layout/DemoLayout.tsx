import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  Menu,
  X,
  Zap,
  GitBranch,
  Bell,
  Star,
  QrCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Plus, label: 'New Proposal', path: '/proposals/new' },
  { icon: FileText, label: 'Proposals', path: '/proposals' },
  { icon: GitBranch, label: 'Pipeline', path: '/pipeline' },
  { icon: Bell, label: 'Follow-ups', path: '/follow-ups' },
  { icon: Star, label: 'Reviews', path: '/reviews' },
  { icon: QrCode, label: 'QR Codes', path: '/qr-codes' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function DemoLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-accent" />
          <span className="text-white font-heading font-bold text-lg">ContractorOS</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-navy flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
          <Zap className="h-7 w-7 text-accent" />
          <span className="text-white font-heading font-bold text-xl">ContractorOS</span>
        </div>

        {/* Demo badge */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-accent/20 border border-accent/30">
          <p className="text-accent text-xs font-medium text-center">DEMO MODE</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-sm font-bold">D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Demo Contractor</p>
              <p className="text-white/50 text-xs truncate">demo@contractoros.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
