'use client';

import Link from 'next/link';
import { Notice } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { timeAgo } from '@/lib/utils';
import UrgencyBadge from './UrgencyBadge';
import { HiOutlineUser, HiOutlinePaperClip, HiOutlineClock, HiOutlineArrowRight } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

interface Props {
  notice: Notice;
  index?: number;
  showExpired?: boolean;
}

export default function NoticeCard({ notice, index = 0, showExpired }: Props) {
  const { appUser } = useAuth();
  const theme = CATEGORY_COLORS[notice.category];
  
  const isTagMatched = (tag: string) => {
    if (!appUser?.tags) return false;
    if (tag.toUpperCase() === 'ALL') return true;
    return appUser.tags.some(userTag => userTag.toUpperCase() === tag.toUpperCase());
  };

  const isUnread = appUser && (!appUser.readNotices || !appUser.readNotices.includes(notice.id));

  return (
    <Link href={`/notice/${notice.id}`} className="group block h-full">
      <div 
        className="notice-card h-full rounded-[20px] p-5 flex flex-col relative overflow-hidden animate-fadeInUp cursor-pointer border-2 border-transparent hover:border-[var(--border-hover)]"
        style={{ 
          backgroundColor: theme.bg,
          animationDelay: `${index * 60}ms` 
        }}
      >
        {/* Category Icon - Top Right */}
        <div 
          className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: theme.iconBg }}
        >
          <CategoryIcon category={notice.category} color={theme.accent} />
        </div>

        {/* Category Label */}
        <div className="mb-3">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
            style={{ 
              backgroundColor: theme.iconBg, 
              color: theme.text,
            }}
          >
            {notice.category}
          </span>
          
          {notice.urgency !== 'Normal' && (
            <span className="ml-2">
              <UrgencyBadge urgency={notice.urgency} />
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-snug mb-2 pr-12 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
          {notice.isPinned && <span className="text-amber-500 mr-1.5">*</span>}
          {notice.title}
        </h3>
        
        {/* Body Preview */}
        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4 flex-grow">
          {notice.body}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-black/5">
          <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1 font-medium">
              <HiOutlineUser className="w-3.5 h-3.5" />
              {notice.postedBy}
            </span>
            {notice.attachmentUrl && (
              <span className="flex items-center gap-1 font-medium" style={{ color: theme.accent }}>
                <HiOutlinePaperClip className="w-3.5 h-3.5" />
                PDF
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-pulse" />
            )}
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-tertiary)]">
              <HiOutlineClock className="w-3.5 h-3.5" />
              {timeAgo(notice.postedAt)}
            </span>
          </div>
        </div>

        {/* Hover Arrow Indicator */}
        <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <HiOutlineArrowRight className="w-4 h-4 text-[var(--text-primary)]" />
        </div>
      </div>
    </Link>
  );
}

// Category Icon Component
function CategoryIcon({ category, color }: { category: string; color: string }) {
  const iconClass = "w-5 h-5";
  
  switch (category) {
    case 'Academic':
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'Placement':
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'Events':
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'Scholarships':
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
    case 'Sports':
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10l7.5 3.5" />
        </svg>
      );
    case 'Hostel':
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
  }
}
