'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { onCommentsSnapshot, addComment, deleteComment, Comment } from '@/lib/firestore';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  noticeId: string;
}

export default function CommentsSection({ noticeId }: Props) {
  const { user, appUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noticeId) return;
    const unsub = onCommentsSnapshot(
      noticeId,
      (data) => {
        setComments(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [noticeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || !appUser) return;
    setSending(true);
    try {
      await addComment(noticeId, {
        text: text.trim(),
        authorName: appUser.name || user.email?.split('@')[0] || 'Student',
        authorEmail: user.email || '',
        authorUid: user.uid,
      });
      setText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
    setSending(false);
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(noticeId, commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const isAdmin = appUser && (appUser.isAdmin || appUser.role === 'admin');

  return (
    <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        💬 Discussion
        <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
              {(appUser?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask a question or leave a comment..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? '⏳ Posting...' : '💬 Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Log in</a> to join the discussion
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin w-6 h-6 rounded-full border-3 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400 dark:text-slate-500">No comments yet. Be the first to ask a question! 🙋</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                {comment.authorName[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {comment.authorName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                      {(user?.uid === comment.authorUid || isAdmin) && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="opacity-0 group-hover:opacity-100 text-[10px] text-rose-500 hover:text-rose-600 font-bold transition-opacity"
                          title="Delete"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
