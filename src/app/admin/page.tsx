'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminNoticeForm from '@/components/AdminNoticeForm';
import AdminAssignmentForm from '@/components/AdminAssignmentForm';
import { addNotice, addAssignment, deleteAssignment } from '@/lib/firestore';
import { useAssignments } from '@/hooks/useAssignments';
import { formatDistanceToNow } from 'date-fns';

export default function AdminPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const { assignments } = useAssignments();
  const [activeTab, setActiveTab] = useState<'notice' | 'assignment'>('notice');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm('Delete this assignment?')) return;
    setDeletingId(id);
    try {
      await deleteAssignment(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment');
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold pb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Admin Dashboard
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Manage notices and assignments for the smart board.</p>
      
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('notice')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'notice'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          📋 Post Notice
        </button>
        <button
          onClick={() => setActiveTab('assignment')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'assignment'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          📚 Assignments
        </button>
      </div>

      {/* Notice Tab */}
      {activeTab === 'notice' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/5 border border-indigo-100 dark:border-slate-800">
          <AdminNoticeForm 
            onSubmit={async (data) => {
              await addNotice(data);
            }} 
          />
        </div>
      )}

      {/* Assignment Tab */}
      {activeTab === 'assignment' && (
        <div className="space-y-6">
          {/* Create Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-amber-500/5 border border-amber-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-xl">📝</span> Create New Assignment
            </h2>
            <AdminAssignmentForm
              onSubmit={async (data) => {
                await addAssignment(data);
              }}
            />
          </div>

          {/* Current Assignments List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-500/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="text-xl">📚</span> Active Assignments</span>
              <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg">
                {assignments.length} Total
              </span>
            </h2>
            {assignments.length === 0 ? (
              <p className="text-sm text-center text-slate-400 py-8">No assignments yet. Create one above! 🎉</p>
            ) : (
              <div className="space-y-3">
                {assignments.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{a.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.course}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
                          ⏰ Due {formatDistanceToNow(a.dueDate, { addSuffix: true })}
                        </span>
                        {a.tags && a.tags.map(t => (
                          <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAssignment(a.id)}
                      disabled={deletingId === a.id}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors disabled:opacity-50 shrink-0"
                    >
                      {deletingId === a.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
