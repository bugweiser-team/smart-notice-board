'use client';

// @ts-ignore
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { useNotices } from '@/hooks/useNotices';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import { HiOutlineCalendar } from 'react-icons/hi';

export default function CalendarWidget() {
  const [date, setDate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const { filteredNotices } = useNotices();

  const colorMap: Record<string, string> = {
    'Academic': '#E11D48',
    'Placement': '#22C55E',
    'Events': '#F97316',
    'Scholarships': '#A855F7',
    'Sports': '#EAB308',
    'Hostel': '#06B6D4',
    'General': '#6B7280'
  };

  const events = filteredNotices.map(n => ({
    id: n.id,
    title: n.title,
    category: n.category,
    date: n.expiryDate || n.postedAt,
    color: colorMap[n.category] || '#6B7280'
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[var(--surface-secondary)] rounded-[20px] border border-[var(--border-primary)] p-5 min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-[var(--text-tertiary)] font-medium text-sm">
          Loading Calendar...
        </div>
      </div>
    );
  }

  const tileContent = ({ date: tileDate, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayEvents = events.filter(e => 
        e.date.getDate() === tileDate.getDate() &&
        e.date.getMonth() === tileDate.getMonth() &&
        e.date.getFullYear() === tileDate.getFullYear()
      );
      if (dayEvents.length > 0) {
        return (
          <div className="flex justify-center gap-0.5 mt-0.5">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div 
                key={i} 
                className="w-1 h-1 rounded-full" 
                style={{ backgroundColor: event.color }}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const selectedDayEvents = events.filter(e => 
    e.date.getDate() === date.getDate() &&
    e.date.getMonth() === date.getMonth() &&
    e.date.getFullYear() === date.getFullYear()
  );

  return (
    <div className="bg-[var(--surface-secondary)] rounded-[20px] border border-[var(--border-primary)] p-5 shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[var(--text-primary)]">Calendar</h3>
        <div className="w-8 h-8 rounded-lg bg-[var(--card-mint)] flex items-center justify-center">
          <HiOutlineCalendar className="w-4 h-4 text-emerald-700" />
        </div>
      </div>

      {/* Calendar */}
      <Calendar 
        onChange={(val: any) => setDate(val as Date)} 
        value={date} 
        tileContent={tileContent}
        className="w-full !font-sans !border-0 bg-transparent react-calendar"
      />
      
      {/* Selected Day Events */}
      <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            {format(date, 'MMMM d, yyyy')}
          </h4>
          <span className="text-xs font-medium text-[var(--text-tertiary)] bg-[var(--surface-tertiary)] px-2 py-1 rounded-full">
            {selectedDayEvents.length} events
          </span>
        </div>
        
        <div className="space-y-2 max-h-[160px] overflow-y-auto">
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)] text-center py-4">
              No events scheduled
            </p>
          ) : (
            selectedDayEvents.map(event => (
              <div 
                key={event.id} 
                className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <div 
                  className="w-1 h-full min-h-[40px] rounded-full shrink-0" 
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                    {event.title}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {event.category}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
