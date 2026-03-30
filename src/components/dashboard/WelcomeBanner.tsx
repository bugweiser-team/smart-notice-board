'use client';

import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function WelcomeBanner() {
  const { appUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    if (!mounted) return 'Welcome';
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2">
        {getGreeting()}, {appUser?.name?.split(' ')[0] || 'Student'}
      </h1>
      <p className="text-[var(--text-secondary)] text-base" suppressHydrationWarning>
        {mounted ? formatDate(new Date()) : ''} {appUser?.department && `| ${appUser.department}`}
      </p>
    </div>
  );
}
