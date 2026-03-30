'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user, appUser } = useAuth();

  // If already logged in, redirect based on role
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
      const u = await loginWithEmail(email, password);
      // Let the AuthContext redirect handle the role-based routing once the profile loads
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-4xl p-8 shadow-2xl space-y-8 relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800">
        
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-extrabold pb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Access
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Sign in to manage the notice board
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="relative z-10 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-white/50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
              placeholder="admin@college.edu"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-white/50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm font-medium text-slate-500 pt-2 z-10 relative">
          Are you a student?{' '}
          <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
