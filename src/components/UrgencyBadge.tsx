'use client';

import { Urgency } from '@/lib/types';
import { URGENCY_STYLES } from '@/lib/constants';

export default function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  if (urgency === 'Normal') return null;
  
  const s = URGENCY_STYLES[urgency];
  
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ 
        backgroundColor: s.bg, 
        color: s.text, 
      }}
    >
      <div 
        className={`w-1.5 h-1.5 rounded-full ${urgency === 'Urgent' ? 'animate-pulse' : ''}`} 
        style={{ backgroundColor: s.dot }} 
      />
      {s.label}
    </span>
  );
}
