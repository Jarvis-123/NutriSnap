'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Analyze', icon: '✨' },
  { href: '/history', label: 'History', icon: '📋' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 sm:hidden">
      <div className="grid grid-cols-3 h-16">
        {links.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className={`text-xs font-medium ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
