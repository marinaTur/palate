import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Layout({ children }) {
  const { t } = useTranslation()

  const NAV = [
    { to: '/',        icon: 'ti-home',     label: t('nav.home')    },
    { to: '/learn',   icon: 'ti-book',     label: t('nav.learn')   },
    { to: '/planner', icon: 'ti-sparkles', label: t('nav.plan')    },
    { to: '/journal', icon: 'ti-notebook', label: t('nav.journal') },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">

      {/* Desktop top bar */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-white/80 backdrop-blur sticky top-0 z-50">
        <NavLink to="/" className="font-['Cormorant_Garamond'] text-2xl font-medium text-[var(--forest)] tracking-tight">
          Palate
        </NavLink>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {NAV.slice(1).map(n => (
              <NavLink
                key={n.to} to={n.to}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[var(--forest-light)] text-[var(--forest)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] safe-bottom z-50">
        <div className="flex">
          {NAV.map(n => (
            <NavLink
              key={n.to} to={n.to} end={n.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                  isActive ? 'text-[var(--forest)]' : 'text-[var(--muted)]'
                }`
              }
            >
              <i className={`ti ${n.icon} text-lg leading-none`} aria-hidden="true"></i>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
