'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { registerStudent } from '@/lib/auth';
import Link from 'next/link';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineAcademicCap, HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi';

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--surface-secondary)] rounded-[28px] p-8 shadow-[var(--shadow-lg)] border border-[var(--border-primary)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--card-mint)] flex items-center justify-center mx-auto mb-4">
              <HiOutlineAcademicCap className="w-7 h-7 text-emerald-700" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Create Account
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Join to personalize your notice feed
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
                  <HiOutlineUser className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Student Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
                  <HiOutlineMail className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
                  placeholder="you@college.edu"
                  required
                />
              </div>
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
                    <HiOutlineAcademicCap className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </div>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="CSE">CSE</option>
                    <option value="BBA">BBA</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Year
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
                    <HiOutlineCalendar className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </div>
                  <select 
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-14 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[var(--accent-lime)] text-[#1A1A2E] font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[var(--accent-lime-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#1A1A2E]/30 border-t-[#1A1A2E] animate-spin" />
              ) : (
                <>
                  Create Account
                  <HiOutlineArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--text-primary)] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
