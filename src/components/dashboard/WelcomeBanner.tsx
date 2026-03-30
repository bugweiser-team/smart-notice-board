'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function WelcomeBanner() {
  const { appUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dateString, setDateString] = useState('');
  const [greeting, setGreeting] = useState('Welcome');
  
  useEffect(() => {
    setMounted(true);
    // Format date on client side only
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    setDateString(formatted);
    
    // Set greeting based on time
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2">
        {greeting}, {appUser?.name?.split(' ')[0] || 'Student'}
      </h1>
      <p className="text-[var(--text-secondary)] text-base">
        {mounted ? dateString : <span className="opacity-0">Loading...</span>}
        {appUser?.department && ` | ${appUser.department}`}
      </p>
    </div>
  );
}
