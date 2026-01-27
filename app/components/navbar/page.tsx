'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Scan Points', href: '/scan-points' },
    { name: 'QR Codes', href: '/dashboard/qr-crud' },
    { name: 'Security Analytics', href: '/analytics/security_analytics' },
    { name: 'Users', href: '/user-crud' },
    { name: 'Reports', href: '/report-download' },
    { name: 'Factories', href: '/factory' },
  ]

  /* ================= ACTIVE ROUTE ================= */
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname === href
  }

  /* ================= CLOSE USER MENU ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* ================= LOGO (HOME) ================= */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="h-9 w-auto relative overflow-hidden rounded-lg">
            <Image
              src="/SRM_BGLESS.png"
              alt="SRM Logo"
              width={190}
              height={40} 
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </Button>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Nav Links Container - Floating Pill Style */}
          <div className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-100 px-1.5 py-1 shadow-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200
                  ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 mx-2"></div>

          {/* ================= USER AVATAR ================= */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200
                ${isUserMenuOpen ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-blue-300'}
              `}
            >
              <User className="h-4 w-4 text-slate-600" />
            </button>

            {/* ================= USER DROPDOWN ================= */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md mx-1"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md mx-1"
                >
                  <User className="w-4 h-4" />
                  Switch User
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-3 font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col gap-1">
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-3 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <User className="w-4 h-4" />
                Login
              </button>
              <button className="flex items-center gap-3 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-3 px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar