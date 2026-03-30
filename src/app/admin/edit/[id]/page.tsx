'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import AdminNoticeForm from '@/components/AdminNoticeForm';
import { updateNotice } from '@/lib/firestore';
import { useNotices } from '@/hooks/useNotices';
import { format } from 'date-fns';

export default function EditNoticePage() {
  const { id } = useParams() as { id: string };
  const { user, appUser, loading: authLoading } = useAuth();
  const { notices, loading: noticesLoading } = useNotices();
  const router = useRouter();

  const notice = notices.find(n => n.id === id);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || noticesLoading) {
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
          This page is restricted to faculty and administrators.
        </p>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95">
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (!notice) {
    return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Notice Not Found</h2>
          <p className="text-slate-500 mt-2">The notice you are trying to edit does not exist.</p>
        </div>
      );
  }

  // Format the Javascript Date back to YYYY-MM-DD for the HTML5 date input
  const initialData = {
    ...notice,
    expiryDate: format(notice.expiryDate, 'yyyy-MM-dd'),
    attachmentUrl: notice.attachmentUrl || '',
    attachmentName: notice.attachmentName || ''
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => router.back()} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          ← Back
        </button>
        <h1 className="text-3xl font-extrabold pb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Edit Notice
        </h1>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Update the details of the notice.</p>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/5 border border-indigo-100 dark:border-slate-800">
        <AdminNoticeForm 
          isEdit={true}
          initialData={initialData}
          onSubmit={async (data) => {
            await updateNotice(id, data);
            router.push(`/notice/${id}`);
          }} 
        />
      </div>
    </div>
  );
}
