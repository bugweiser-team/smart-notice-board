'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineHome, HiOutlineArchive, HiOutlineCog } from 'react-icons/hi';

const tabs = [
  { href: '/', label: 'Home', icon: HiOutlineHome },
  { href: '/archive', label: 'Archive', icon: HiOutlineArchive },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { appUser } = useAuth();
  const isAdmin = appUser?.isAdmin;
  
  const allTabs = isAdmin 
    ? [...tabs, { href: '/admin', label: 'Admin', icon: HiOutlineCog }] 
    : tabs;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-primary)]/95 backdrop-blur-xl border-t border-[var(--border-primary)] safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-200 ${
                active
                  ? 'bg-[var(--accent-lime)] text-[#1A1A2E]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[11px] font-semibold ${active ? 'text-[#1A1A2E]' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
