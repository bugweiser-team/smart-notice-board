'use client';

import { Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { HiOutlineViewGrid, HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineCalendar, HiOutlineStar, HiOutlineLightningBolt, HiOutlineHome, HiOutlineBell } from 'react-icons/hi';

interface Props {
  category: Category | 'All';
  active: boolean;
  onClick: () => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'All': HiOutlineViewGrid,
  'Academic': HiOutlineAcademicCap,
  'Placement': HiOutlineBriefcase,
  'Events': HiOutlineCalendar,
  'Scholarships': HiOutlineStar,
  'Sports': HiOutlineLightningBolt,
  'Hostel': HiOutlineHome,
  'General': HiOutlineBell,
};

export default function CategoryPill({ category, active, onClick }: Props) {
  const isAll = category === 'All';
  
  const theme = isAll 
    ? {
        bg: '#1A1A2E',
        text: '#FFFFFF',
        activeBg: '#1A1A2E',
        activeText: '#FFFFFF',
        iconBg: '#D4F57A',
      }
    : CATEGORY_COLORS[category];

  const Icon = categoryIcons[category] || HiOutlineBell;

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 h-[44px] px-4 rounded-full whitespace-nowrap transition-all duration-200 active:scale-95 font-medium text-[13px] ${
        active 
          ? 'shadow-md' 
          : 'bg-white border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
      }`}
      style={active ? { 
        backgroundColor: isAll ? '#1A1A2E' : theme.bg, 
        color: isAll ? '#FFFFFF' : theme.text,
      } : {}}
    >
      <span 
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? '' : 'bg-[var(--surface-tertiary)]'}`}
        style={active ? { 
          backgroundColor: isAll ? '#D4F57A' : theme.iconBg,
        } : {}}
      >
        <Icon 
          className="w-4 h-4" 
          style={{ color: active ? (isAll ? '#1A1A2E' : theme.accent) : 'var(--text-tertiary)' }}
        />
      </span>
      <span>{category}</span>
    </button>
  );
}
