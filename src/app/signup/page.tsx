'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { registerStudent } from '@/lib/auth';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'CSE',
    year: '1',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await registerStudent(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.department, 
        parseInt(formData.year)
      );
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-white/50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400";
  const lbl = "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-4xl p-8 shadow-2xl space-y-8 relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800">
        
        <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-extrabold pb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Signup
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Create an account to personalize your feed
          </p>
        </div>
        
        <form onSubmit={handleSignup} className="relative z-10 space-y-5">
          <div>
            <label className={lbl}>Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={inp}
              placeholder="Alice Walker"
              required
            />
          </div>
          <div>
            <label className={lbl}>Student Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={inp}
              placeholder="alice@college.edu"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Department</label>
              <select 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className={inp}
              >
                <option value="CSE">CSE</option>
                <option value="BBA">BBA</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Year</label>
              <select 
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className={inp}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={inp}
              placeholder="••••••••"
              required
              minLength={6}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm font-medium text-slate-500 pt-2 z-10 relative">
          Faculty member?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
