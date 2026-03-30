'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineHome, HiOutlineArchive, HiOutlineCog, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

const navItems = [
  { href: '/', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/archive', label: 'Archive', icon: HiOutlineArchive },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, appUser, isFirebaseConfigured } = useAuth();
  const isAdmin = appUser?.isAdmin;

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
    <aside className="hidden lg:flex flex-col w-[260px] bg-[var(--surface-sidebar)] rounded-[28px] m-4 mr-0 overflow-hidden">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-lime)] flex items-center justify-center">
            <HiOutlineSquares2X2 className="w-5 h-5 text-[#1A1A2E]" />
          </div>
          <span className="text-lg font-bold text-white">NoticeBoard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[15px] ${
                isActive
                  ? 'active bg-[var(--accent-lime)] text-[#1A1A2E]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={`sidebar-nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[15px] ${
              pathname === '/admin'
                ? 'active bg-[var(--accent-lime)] text-[#1A1A2E]'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <HiOutlineCog className="w-5 h-5" />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-4 mt-auto border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-lime)] to-emerald-400 flex items-center justify-center text-[#1A1A2E] font-bold text-sm">
              {(appUser?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {appUser?.name || 'User'}
              </p>
              <p className="text-xs text-white/50 truncate">
                {appUser?.department || 'Student'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            <HiOutlineLogout className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {!user && (
        <div className="p-4 mt-auto">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--accent-lime)] text-[#1A1A2E] font-semibold text-sm hover:bg-[var(--accent-lime-hover)] transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </aside>
  );
}
