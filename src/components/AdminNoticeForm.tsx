'use client';
import { useState } from 'react';
import { Category, Urgency, NoticeFormData } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Smart tag suggestions based on category
function getTagSuggestions(category: Category): string[] {
  const common = ['ALL', 'CSE-3', 'CSE-4', 'BBA-3', 'BBA-4', 'BCOM-3', 'BCOM-4'];
  const map: Record<Category, string[]> = {
    Academic: ['CSE-1', 'CSE-2', 'CSE-3', 'CSE-4', 'BBA-1', 'BBA-2', 'BBA-3', 'BBA-4', 'BCOM-3', 'ALL'],
    Placement: ['CSE-4', 'BBA-4', 'BCOM-4', 'CSE-3', 'BBA-3', 'ALL'],
    Events: ['ALL', 'CSE-3', 'CSE-4', 'BBA-3', 'BBA-4'],
    Scholarships: ['ALL', 'CSE-1', 'CSE-2', 'BBA-1', 'BBA-2', 'BCOM-1', 'BCOM-2'],
    Sports: ['ALL', 'CSE-3', 'CSE-4', 'BBA-3'],
    Hostel: ['ALL', 'HOSTEL-A', 'HOSTEL-B', 'HOSTEL-C'],
    General: common,
  };
  return map[category] || common;
}

interface Props {
  onSubmit: (data: NoticeFormData) => Promise<void>;
  initialData?: Partial<NoticeFormData> & { tags?: string[] };
  isEdit?: boolean;
}

export default function AdminNoticeForm({ onSubmit, initialData, isEdit }: Props) {
  const [form, setForm] = useState<NoticeFormData>({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'Academic',
    tags: initialData?.tags || ['ALL'],
    urgency: initialData?.urgency || 'Normal',
    expiryDate: initialData?.expiryDate || '',
    isPinned: initialData?.isPinned || false,
    postedBy: initialData?.postedBy || '',
    attachmentUrl: initialData?.attachmentUrl || '',
    attachmentName: initialData?.attachmentName || '',
  });
  const [tagInput, setTagInput] = useState<string>(
    initialData?.tags?.join(', ') || 'ALL'
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.expiryDate || !form.postedBy) {
      setMsg('❌ Fill all required fields');
      return;
    }
    
    setLoading(true);
    setMsg('');
    
    try {
      let finalAttachmentUrl = form.attachmentUrl;
      let finalAttachmentName = form.attachmentName;

      if (file) {
        setMsg('⏳ Uploading attachment...');
        finalAttachmentUrl = await uploadToCloudinary(file);
        finalAttachmentName = file.name;
        setMsg('✅ Upload complete. Publishing notice...');
      }

      // Process tags
      const processedTags = tagInput
        .split(',')
        .map(t => t.trim().toUpperCase())
        .filter(t => t !== '');
        
      const submissionData = {
        ...form,
        attachmentUrl: finalAttachmentUrl,
        attachmentName: finalAttachmentName,
        tags: processedTags.length > 0 ? processedTags : ['ALL']
      };

      await onSubmit(submissionData);

      // Ping the Push Notification engine if it is an Urgent or Important message
      if (form.urgency !== 'Normal') {
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `[${form.urgency.toUpperCase()}] ${form.category} Notice`,
            body: form.title,
            urgency: form.urgency,
            topic: 'ALL'
          })
        }).catch(err => console.log("Push failed:", err));
      }

      setMsg(isEdit ? '✅ Notice updated!' : '✅ Notice posted successfully!');
      
      if (!isEdit) {
        setForm({
          title: '', body: '', category: 'Academic', tags: ['ALL'], urgency: 'Normal',
          expiryDate: '', isPinned: false, postedBy: '',
          attachmentUrl: '', attachmentName: '',
        });
        setTagInput('ALL');
      }
    } catch {
      setMsg('❌ Failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full px-4 py-3 rounded-xl border border-[var(--border-primary)] bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all';
  const lbl = 'block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={lbl}>Title <span className="text-red-500">*</span></label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} className={inp} placeholder="Notice title" />
      </div>
      <div>
        <label className={lbl}>Description <span className="text-red-500">*</span></label>
        <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} className={`${inp} resize-none`} placeholder="Notice description" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Category <span className="text-red-500">*</span></label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={inp}>
            {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className={lbl}>Expiry Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={inp} />
        </div>
      </div>
      <div>
        <label className={lbl}>Target Tags (Comma separated) <span className="text-red-500">*</span></label>
        <input 
          value={tagInput} 
          onChange={(e) => setTagInput(e.target.value)} 
          className={inp} 
          placeholder="e.g. ALL or CSE-3, BBA-4" 
        />
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium ml-1">Use "ALL" for public notices, or target specific groups like "CSE-3".</p>
        {/* Smart Tag Suggestions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {getTagSuggestions(form.category).map(tag => {
            const isActive = tagInput.toUpperCase().includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (isActive) return;
                  setTagInput(prev => prev.trim() === '' || prev.trim() === 'ALL' ? tag : `${prev}, ${tag}`);
                }}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer'
                }`}
              >
                {isActive ? '✓ ' : '+ '}{tag}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className={lbl}>Urgency</label>
        <div className="flex flex-wrap gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-[var(--border-primary)]">
          {(['Normal', 'Important', 'Urgent'] as Urgency[]).map((u) => (
            <label key={u} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="urgency" value={u} checked={form.urgency === u} onChange={() => setForm({ ...form, urgency: u })} className="accent-indigo-600 w-4 h-4" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{u}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl">
        <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} className="accent-amber-600 w-5 h-5 rounded" />
        <label className="text-sm font-bold text-amber-900 dark:text-amber-300">Pin to top of feed</label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Posted By <span className="text-red-500">*</span></label>
          <input value={form.postedBy} onChange={(e) => setForm({ ...form, postedBy: e.target.value })} className={inp} placeholder="Your name / Dept" />
        </div>
        <div>
          <label className={lbl}>Attachment (Optional)</label>
          <div className="relative">
            <input 
              type="file" 
              onChange={(e) => e.target.files && setFile(e.target.files[0])} 
              className={`${inp} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 p-2`} 
            />
            {form.attachmentUrl && !file && (
              <p className="text-xs text-indigo-600 mt-2 truncate">Current: {form.attachmentUrl}</p>
            )}
          </div>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${msg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {msg}
        </div>
      )}
      
      <button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20">
        {loading ? '⏳ Processing...' : isEdit ? '✏️ Save Changes' : '🚀 Publish Notice'}
      </button>
    </form>
  );
}
