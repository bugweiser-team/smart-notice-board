'use client';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toggleAssignmentCompletion } from '@/lib/firestore';
import { useState } from 'react';

export default function AssignmentsWidget() {
  const { assignments } = useDashboardData();
  const { user, appUser } = useAuth();
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set());
  
  // Merge server-side completions with local optimistic updates
  const completedIds = new Set([
    ...(appUser?.completedAssignments || []),
    ...localCompleted,
  ]);

  // Sort by closest due date, show uncompleted first
  const pending = assignments
    .filter(a => !completedIds.has(a.id))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const handleToggle = async (assignmentId: string) => {
    if (!user) return;
    // Optimistic update
    setLocalCompleted(prev => new Set(prev).add(assignmentId));
    try {
      await toggleAssignmentCompletion(user.uid, assignmentId, true);
    } catch (err) {
      console.error('Failed to mark complete:', err);
      // Revert optimistic update
      setLocalCompleted(prev => {
        const next = new Set(prev);
        next.delete(assignmentId);
        return next;
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border-primary)] p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold">Pending Assignments</h3>
        <span className="text-xs font-semibold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-1 rounded-md">
          {pending.length} Due
        </span>
      </div>
      
      <div className="space-y-3">
        {pending.length === 0 ? (
          <p className="text-xs text-center text-gray-400 py-4">All caught up! 🎉</p>
        ) : (
          pending.map(assignment => (
            <div key={assignment.id} className="group relative p-3 rounded-xl border border-[var(--border-primary)] hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                  {assignment.title}
                </p>
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer shrink-0"
                  title="Mark as complete"
                  onChange={() => handleToggle(assignment.id)}
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
