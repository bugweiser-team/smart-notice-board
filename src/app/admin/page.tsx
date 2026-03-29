'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminNoticeForm from '@/components/AdminNoticeForm';
import { addNotice } from '@/lib/firestore';

export default function AdminPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Block non-admin users
  if (appUser && !appUser.isAdmin && appUser.role !== 'admin') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mb-2">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
          This page is restricted to faculty and administrators. If you believe this is an error, contact your institution.
        </p>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold pb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Admin Dashboard
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Post a new notice to the smart board with file attachments.</p>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/5 border border-indigo-100 dark:border-slate-800">
        <AdminNoticeForm 
          onSubmit={async (data) => {
            await addNotice(data);
          }} 
        />
      </div>
    </div>
  );
}
