'use client';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export default function WelcomeBanner() {
  const { appUser } = useAuth();
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative w-full">
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {appUser?.name.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-blue-100 text-sm">
            {formatDate(new Date())} • {appUser?.department || 'Select Department'}
          </p>
        </div>
      </div>
    </div>
  );
}
