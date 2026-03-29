'use client';

import Link from 'next/link';
import { Notice } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { timeAgo } from '@/lib/utils';
import UrgencyBadge from './UrgencyBadge';
import { HiOutlineUser, HiOutlineTag, HiOutlinePaperClip, HiOutlineClock } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

interface Props {
  notice: Notice;
  index?: number;
  showExpired?: boolean;
}

export default function NoticeCard({ notice, index = 0, showExpired }: Props) {
  const { appUser } = useAuth();
  const theme = CATEGORY_COLORS[notice.category];
  
  // Highlight tags that match user's tags
  const isTagMatched = (tag: string) => {
    if (!appUser?.tags) return false;
    if (tag.toUpperCase() === 'ALL') return true;
    return appUser.tags.some(userTag => userTag.toUpperCase() === tag.toUpperCase());
  };

  const isUnread = appUser && (!appUser.readNotices || !appUser.readNotices.includes(notice.id));

  return (
    <Link href={`/notice/${notice.id}`} className="group block h-full">
      <div 
        className="notice-card h-full bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col relative overflow-hidden transition-all duration-200 ease-out animate-fadeInUp cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Decorative top accent line for pinned notices */}
        {notice.isPinned && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        )}

        {/* Row 1: Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Category Pill */}
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border"
              style={{ 
                backgroundColor: theme.bg, 
                color: theme.text,
                borderColor: theme.border,
              }}
            >
              <span>{theme.icon}</span> {notice.category}
            </span>
            <UrgencyBadge urgency={notice.urgency} />
            
            {showExpired && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Expired
              </span>
            )}
            
            {isUnread && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white animate-pulse">
                NEW
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {timeAgo(notice.postedAt)}
          </span>
        </div>

        {/* Row 2: Title */}
        <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {notice.isPinned && <span className="mr-1.5 text-indigo-500">📌</span>}
          {notice.title}
        </h3>
        
        {/* Row 3: Body */}
        <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-grow">
          {notice.body}
        </p>

        {/* Row 4: Subtle divider & Footer metadata */}
        <div className="mt-auto pt-2 border-t border-dashed border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <HiOutlineUser /> {notice.postedBy}
            </span>
            {notice.attachmentUrl && (
              <span className="flex items-center gap-1 text-indigo-500">
                <HiOutlinePaperClip /> PDF
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 shrink-0">
            <HiOutlineClock /> Exp: {notice.expiryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Row 5: Tags */}
        {(notice.tags && notice.tags.length > 0) && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            <HiOutlineTag className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 mr-0.5" />
            {notice.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${
                  isTagMatched(tag) 
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {tag}
              </span>
            ))}
            {notice.tags.length > 3 && (
              <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">+{notice.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
