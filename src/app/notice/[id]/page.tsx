'use client';
import { useNotices } from '@/hooks/useNotices';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORY_ICONS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { markNoticeAsRead, deleteNotice } from '@/lib/firestore';

export default function NoticeDetailPage() {
  const { id } = useParams() as { id: string };
  const { notices, loading } = useNotices();
  const { user, appUser } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const notice = notices.find(n => n.id === id);
  const isAdmin = appUser && (appUser.isAdmin || appUser.role === 'admin');

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this notice?")) {
      setIsDeleting(true);
      try {
        await deleteNotice(notice!.id);
        router.push('/');
      } catch (err) {
        console.error(err);
        alert("Failed to delete notice");
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    if (notice && user && appUser && (!appUser.readNotices || !appUser.readNotices.includes(notice.id))) {
      markNoticeAsRead(user.uid, notice.id).catch(err => {
        console.error("Failed to mark read:", err);
      });
    }
  }, [notice, user, appUser]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Notice Not Found</h2>
        <p className="text-slate-500 mt-2">The notice you are looking for does not exist or has expired.</p>
        <button onClick={() => router.push('/')} className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-8 h-full min-h-[70vh]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          ← Back
        </button>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push(`/admin/edit/${notice.id}`)}
              className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-lg text-sm hover:bg-indigo-100 transition-colors"
            >
              ✏️ Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-bold rounded-lg text-sm hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "⏳ Deleting..." : "🗑️ Delete"}
            </button>
          </div>
        )}
      </div>
      
      <article className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 md:p-10 shadow-xl shadow-indigo-500/5 border border-[var(--border-primary)]">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-800">
            {CATEGORY_ICONS[notice.category]} {notice.category}
          </span>
          {notice.isPinned && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold">📌 Pinned</span>}
          {notice.urgency === 'Urgent' && <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-full text-sm font-bold">🚨 Urgent</span>}
          {notice.urgency === 'Important' && <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold">🔔 Important</span>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight break-words">
          {notice.title}
        </h1>
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {notice.postedBy.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{notice.postedBy}</p>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                {formatDistanceToNow(notice.postedAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-10 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {notice.body}
        </div>

        {notice.attachmentUrl && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wider">Attached File</h3>
            <a 
              href={notice.attachmentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 group border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 truncate">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 text-xl shadow-sm">
                  📄
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 truncate">
                    {notice.attachmentName || 'Download Document'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Click to view</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                &rarr;
              </div>
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
