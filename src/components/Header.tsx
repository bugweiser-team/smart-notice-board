'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, isFirebaseConfigured } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NoticeBoard</span>
        </Link>
        <div className="flex items-center gap-2">
          {!isFirebaseConfigured && (
            <span className="hidden md:block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">OFFLINE DEMO</span>
          )}
          <ThemeToggle />
          {user ? (
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to log out?')) {
                  if (!isFirebaseConfigured) {
                    localStorage.removeItem('mockRole');
                    window.location.href = '/login';
                  } else {
                    import('@/lib/auth').then(({ logout }) => logout());
                  }
                }
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              {(user.email?.[0] || 'U').toUpperCase()}
            </button>
          ) : (
            <Link href="/login" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
