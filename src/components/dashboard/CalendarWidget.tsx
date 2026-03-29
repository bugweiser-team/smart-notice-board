'use client';
import Calendar from 'react-calendar';
import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';

export default function CalendarWidget() {
  const [date, setDate] = useState<Date>(new Date());
  const { events } = useEvents();

  // Highlight days with events
  const tileContent = ({ date: tileDate, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayEvents = events.filter(e => 
        e.date.getDate() === tileDate.getDate() &&
        e.date.getMonth() === tileDate.getMonth() &&
        e.date.getFullYear() === tileDate.getFullYear()
      );
      if (dayEvents.length > 0) {
        return (
          <div className="flex justify-center gap-1 mt-1">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 rounded-full" 
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border-primary)] p-5 w-full">
      <h3 className="text-base font-bold mb-4">Academic Calendar</h3>
      <Calendar 
        onChange={(val) => setDate(val as Date)} 
        value={date} 
        tileContent={tileContent}
        className="w-full !font-sans !border-0 bg-transparent react-calendar"
      />
      
      <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
        <h4 className="text-sm font-semibold mb-3 flex justify-between">
          <span>{format(date, 'MMM d, yyyy')}</span>
          <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {selectedDayEvents.length} events
          </span>
        </h4>
        <div className="space-y-2">
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">No scheduled events</p>
          ) : (
            selectedDayEvents.map(event => (
              <div key={event.id} className="flex gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: event.color }}></div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{event.title}</p>
                  <p className="text-[10px] text-gray-500">{event.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
