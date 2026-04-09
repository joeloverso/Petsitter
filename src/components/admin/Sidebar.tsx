'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
  { label: 'Messages', href: '/admin/messages', icon: '✉️' },
  { label: 'Calendar', href: '/admin/calendar', icon: '📅' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📊' },
  { label: 'Edit Content', href: '/admin/content', icon: '✏️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-16 md:w-56 bg-driftwood text-white flex flex-col min-h-screen shrink-0">
      {/* Brand */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Image
          src="/images/Transparent_Logo_Icons.png"
          alt="Logo"
          width={32}
          height={32}
          className="brightness-200 shrink-0"
        />
        <span className="font-display text-base hidden md:block">Trusty Paws</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1 pt-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold ${
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="hidden md:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold"
        >
          <span className="text-lg shrink-0">🚪</span>
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
