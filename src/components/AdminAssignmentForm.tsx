'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (data: {
    title: string;
    course: string;
    description: string;
    dueDate: string;
    tags: string[];
    postedBy: string;
  }) => Promise<void>;
}

export default function AdminAssignmentForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('ALL');
  const [postedBy, setPostedBy] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !course || !dueDate) return;
    setStatus('loading');
    try {
      await onSubmit({
        title,
        course,
        description,
        dueDate,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        postedBy: postedBy || 'Admin',
      });
      setStatus('success');
      setTitle('');
      setCourse('');
      setDescription('');
      setDueDate('');
      setTags('ALL');
      setPostedBy('');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const lbl = "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider";
  const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-slate-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Assignment Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inp} placeholder="e.g. Data Structures Lab 5" required />
        </div>
        <div>
          <label className={lbl}>Course *</label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} className={inp} placeholder="e.g. Data Structures (CS301)" required />
        </div>
      </div>
      <div>
        <label className={lbl}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inp + " min-h-[80px] resize-none"} placeholder="Brief description of the assignment..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>Due Date *</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inp} required />
        </div>
        <div>
          <label className={lbl}>Target Tags</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inp} placeholder="ALL or CSE-3" />
        </div>
        <div>
          <label className={lbl}>Posted By</label>
          <input value={postedBy} onChange={(e) => setPostedBy(e.target.value)} className={inp} placeholder="Prof. name" />
        </div>
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 cursor-pointer"
      >
        {status === 'loading' ? '⏳ Creating...' : status === 'success' ? '✅ Assignment Created!' : status === 'error' ? '❌ Failed. Try again.' : '📚 Create Assignment'}
      </button>
    </form>
  );
}
