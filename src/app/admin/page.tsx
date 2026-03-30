'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminNoticeForm from '@/components/AdminNoticeForm';
import AdminAssignmentForm from '@/components/AdminAssignmentForm';
import { addNotice, addAssignment, deleteAssignment } from '@/lib/firestore';
import { useAssignments } from '@/hooks/useAssignments';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineClipboardList, HiOutlineAcademicCap, HiOutlineTrash, HiOutlineClock, HiOutlineLockClosed } from 'react-icons/hi';

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
        <div className="w-10 h-10 rounded-full border-3 border-[var(--accent-lime)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Block non-admin users
  if (appUser && !appUser.isAdmin && appUser.role !== 'admin') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[var(--card-pink)] flex items-center justify-center mb-6">
          <HiOutlineLockClosed className="w-10 h-10 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h2>
        <p className="text-[var(--text-secondary)] max-w-md mb-6">
          This page is restricted to faculty and administrators. If you believe this is an error, contact your institution.
        </p>
        <button 
          onClick={() => router.push('/')} 
          className="px-6 py-3 bg-[var(--surface-sidebar)] text-white rounded-xl font-semibold hover:bg-[#2D2D44] transition-colors"
        >
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
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage notices and assignments for the smart board.
        </p>
      </div>
      
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('notice')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'notice'
              ? 'bg-[var(--surface-sidebar)] text-white shadow-lg'
              : 'bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
          }`}
        >
          <HiOutlineClipboardList className="w-4 h-4" />
          Post Notice
        </button>
        <button
          onClick={() => setActiveTab('assignment')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'assignment'
              ? 'bg-[var(--accent-lime)] text-[#1A1A2E] shadow-lg'
              : 'bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
          }`}
        >
          <HiOutlineAcademicCap className="w-4 h-4" />
          Assignments
        </button>
      </div>

      {/* Notice Tab */}
      {activeTab === 'notice' && (
        <div className="bg-[var(--surface-secondary)] rounded-[24px] p-6 md:p-8 shadow-[var(--shadow-card)] border border-[var(--border-primary)]">
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
          <div className="bg-[var(--surface-secondary)] rounded-[24px] p-6 md:p-8 shadow-[var(--shadow-card)] border border-[var(--border-primary)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--card-mint)] flex items-center justify-center">
                <HiOutlineAcademicCap className="w-4 h-4 text-emerald-700" />
              </div>
              Create New Assignment
            </h2>
            <AdminAssignmentForm
              onSubmit={async (data) => {
                await addAssignment(data);
              }}
            />
          </div>

          {/* Current Assignments List */}
          <div className="bg-[var(--surface-secondary)] rounded-[24px] p-6 md:p-8 shadow-[var(--shadow-card)] border border-[var(--border-primary)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--card-peach)] flex items-center justify-center">
                  <HiOutlineClipboardList className="w-4 h-4 text-orange-700" />
                </div>
                Active Assignments
              </h2>
              <span className="text-xs font-semibold bg-[var(--card-peach)] text-orange-700 px-3 py-1.5 rounded-full">
                {assignments.length} Total
              </span>
            </div>
            
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center mx-auto mb-4">
                  <HiOutlineAcademicCap className="w-8 h-8 text-[var(--text-tertiary)]" />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">No assignments yet</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Create one using the form above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map(a => (
                  <div 
                    key={a.id} 
                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-hover)] bg-[var(--surface-primary)] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        {a.course}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-[var(--card-peach)] px-2 py-1 rounded-lg">
                          <HiOutlineClock className="w-3 h-3" />
                          Due {formatDistanceToNow(a.dueDate, { addSuffix: true })}
                        </span>
                        {a.tags && a.tags.map(t => (
                          <span 
                            key={t} 
                            className="text-[10px] font-medium text-[var(--text-tertiary)] bg-[var(--surface-tertiary)] px-2 py-1 rounded-lg"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAssignment(a.id)}
                      disabled={deletingId === a.id}
                      className="w-10 h-10 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-rose-600 flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                    >
                      {deletingId === a.id ? (
                        <div className="w-4 h-4 rounded-full border-2 border-rose-600/30 border-t-rose-600 animate-spin" />
                      ) : (
                        <HiOutlineTrash className="w-4 h-4" />
                      )}
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
