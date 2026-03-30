'use client';

import { ReactNode } from 'react';
import Header from '../Header';
import BottomNav from '../BottomNav';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--shell-bg)]">
      {/* Desktop Layout: Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:p-4 lg:pl-0">
          {/* Content Container with rounded corners on desktop */}
          <div className="flex-1 bg-[var(--surface-primary)] lg:rounded-[28px] lg:shadow-lg overflow-hidden flex flex-col">
            <Header />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Bottom Nav - Mobile only */}
      <BottomNav />
    </div>
  );
}
