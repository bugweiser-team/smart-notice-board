'use client';

import { ReactNode } from 'react';
import Header from '../Header';
import BottomNav from '../BottomNav';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 pb-32">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
