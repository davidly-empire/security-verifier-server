// app/components/navbar/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Shield } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

import { Button } from '@/app/components/ui/button';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Scanpoints', href: '/scan-points' },
  { name: 'QR', href: '/dashboard/qr-crud' }, // ✅ ADD THIS
  { name: 'Security Activities', href: '/security-activities' },
  { name: 'Security Info', href: '/security-info' },
  { name: 'Add Users', href: '/users' },
  { name: 'Reports', href: '/reports' },
];


  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/' || pathname === '/dashboard';
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080883] shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 transition-all duration-200 hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/20 text-white
                          transition-all duration-200 hover:shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold text-white">
            Security-Verifier
          </span>
        </Link>

        {/* Hamburger — SHOW <= 1050px */}
        <Button
          variant="ghost"
          size="icon"
          className="max-[1050px]:flex hidden transition-all duration-200
                     hover:-translate-y-[1px] hover:shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* Desktop Nav — SHOW > 1050px */}
        <nav className="hidden min-[1051px]:flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
                hover:-translate-y-[1px] hover:shadow-sm
                ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-[#080883]'
                    : 'text-gray-600 hover:text-[#080883]'
                }
              `}
            >
              {item.name}
            </Link>
          ))}

          {/* Avatar inside ellipse */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full
                           bg-[#080883]/10 transition-all duration-200
                           hover:-translate-y-[1px] hover:shadow-md"
              >
                <User className="h-5 w-5 text-[#080883]" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* MOBILE MENU — ONLY <= 1050px */}
      {isMobileMenuOpen && (
        <div className="max-[1050px]:block hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">

            {/* Mobile Avatar */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <User className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">
                  admin@security-verifier.com
                </p>
              </div>
            </div>

            {/* Mobile Nav */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all
                    hover:-translate-y-[1px]
                    ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-md transition hover:bg-gray-50">
                Profile
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md transition hover:bg-gray-50">
                Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md text-red-600 transition hover:bg-red-50">
                Log out
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
