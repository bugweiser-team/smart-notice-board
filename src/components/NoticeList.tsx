'use client';
import { Notice } from '@/lib/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface Props {
  notices: Notice[];
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
}

export default function NoticeList({ notices, onEdit, onDelete, onTogglePin }: Props) {
  return (
    <div className="space-y-2">
      {notices.map((n) => {
        const color = CATEGORY_COLORS[n.category];
        return (
          <div key={n.id} className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color.bg, color: color.text }}>
                  {CATEGORY_ICONS[n.category]} {n.category}
                </span>
                {n.isPinned && <span className="text-xs">📌</span>}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{n.title}</p>
              <p className="text-xs text-gray-400">{formatDate(n.postedAt)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onTogglePin(n.id, !n.isPinned)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm cursor-pointer" title={n.isPinned ? 'Unpin' : 'Pin'}>
                {n.isPinned ? '📌' : '📍'}
              </button>
              <button onClick={() => onEdit(n)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm cursor-pointer">✏️</button>
              <button onClick={() => { if (confirm('Delete this notice?')) onDelete(n.id); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm cursor-pointer">🗑️</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
