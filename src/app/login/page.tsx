'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/auth';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user, appUser } = useAuth();

  useEffect(() => {
    if (user && appUser) {
      if (appUser.role === 'admin' || appUser.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, appUser, router]);

  if (user && appUser) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--surface-secondary)] rounded-[28px] p-8 shadow-[var(--shadow-lg)] border border-[var(--border-primary)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-sidebar)] flex items-center justify-center mx-auto mb-4">
              <span className="text-[var(--accent-lime)] font-bold text-xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
                  <HiOutlineMail className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
                  <HiOutlineLockClosed className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-sm font-medium flex items-center gap-2">
                <span className="shrink-0">Warning:</span> {error}
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[var(--surface-sidebar)] text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#2D2D44] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Sign In
                  <HiOutlineArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Are you a student?{' '}
            <Link href="/signup" className="text-[var(--text-primary)] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
