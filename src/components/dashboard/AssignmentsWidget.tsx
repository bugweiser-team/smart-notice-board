'use client';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatDistanceToNow } from 'date-fns';

export default function AssignmentsWidget() {
  const { assignments } = useDashboardData();
  
  // Sort by closest due date
  const pending = assignments
    .filter(a => !a.isCompleted)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border-primary)] p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold">Pending Assignments</h3>
        <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-1 rounded-md">
          {pending.length} Due
        </span>
      </div>
      
      <div className="space-y-3">
        {pending.length === 0 ? (
          <p className="text-xs text-center text-gray-400 py-4">All caught up! 🎉</p>
        ) : (
          pending.map(assignment => (
            <div key={assignment.id} className="group relative p-3 rounded-xl border border-[var(--border-primary)] hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                  {assignment.title}
                </p>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer shrink-0"
                  title="Mark as complete"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                {assignment.course}
              </p>
              <div className="flex items-center text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 w-fit px-2 py-0.5 rounded-md">
                ⏰ Due {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
