'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, appUser, isFirebaseConfigured } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      if (!isFirebaseConfigured) {
        localStorage.removeItem('mockRole');
        window.location.href = '/login';
      } else {
        import('@/lib/auth').then(({ logout }) => logout());
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)] lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16 lg:h-20">
        {/* Mobile Logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--surface-sidebar)] flex items-center justify-center">
            <span className="text-[var(--accent-lime)] font-bold text-sm">N</span>
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)]">NoticeBoard</span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search notices..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white dark:bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {!isFirebaseConfigured && (
            <span className="hidden md:block text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1.5 rounded-full">
              DEMO MODE
            </span>
          )}

          <ThemeToggle />

          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Avatar - Mobile & Desktop */}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-lime)] to-emerald-400 flex items-center justify-center text-[#1A1A2E] font-bold text-sm hover:scale-105 transition-transform cursor-pointer"
            >
              {(appUser?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-[var(--surface-sidebar)] text-white text-sm font-semibold hover:bg-[var(--surface-sidebar)]/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
