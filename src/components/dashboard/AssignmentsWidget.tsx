'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toggleAssignmentCompletion } from '@/lib/firestore';
import { useState } from 'react';
import { HiOutlineClipboardList, HiOutlineCheck, HiOutlineClock } from 'react-icons/hi';

export default function AssignmentsWidget() {
  const { assignments } = useDashboardData();
  const { user, appUser } = useAuth();
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set());
  
  const completedIds = new Set([
    ...(appUser?.completedAssignments || []),
    ...localCompleted,
  ]);

  const pending = assignments
    .filter(a => !completedIds.has(a.id))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const handleToggle = async (assignmentId: string) => {
    if (!user) return;
    setLocalCompleted(prev => new Set(prev).add(assignmentId));
    try {
      await toggleAssignmentCompletion(user.uid, assignmentId, true);
    } catch (err) {
      console.error('Failed to mark complete:', err);
      setLocalCompleted(prev => {
        const next = new Set(prev);
        next.delete(assignmentId);
        return next;
      });
    }
  };

  // Status colors matching reference design
  const getStatusStyle = (dueDate: Date) => {
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 1) {
      return { bg: '#FEE2E2', text: '#DC2626', label: 'Urgent' };
    }
    if (daysUntilDue <= 3) {
      return { bg: '#FEF3C7', text: '#D97706', label: 'Soon' };
    }
    return { bg: '#D4F5E4', text: '#166534', label: 'On Track' };
  };

  return (
    <div className="bg-[var(--surface-secondary)] rounded-[20px] border border-[var(--border-primary)] p-5 shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[var(--text-primary)]">Assignments</h3>
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            {pending.length} Due
          </span>
        </div>
      </div>
      
      {/* Assignment List */}
      <div className="space-y-3">
        {pending.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[var(--card-mint)] flex items-center justify-center mx-auto mb-3">
              <HiOutlineCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">All caught up!</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">No pending assignments</p>
          </div>
        ) : (
          pending.map(assignment => {
            const status = getStatusStyle(assignment.dueDate);
            return (
              <div 
                key={assignment.id} 
                className="group p-4 rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-hover)] bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(assignment.id)}
                    className="mt-0.5 w-5 h-5 rounded-lg border-2 border-[var(--border-primary)] flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors shrink-0"
                    title="Mark as complete"
                  >
                    <HiOutlineCheck className="w-3 h-3 text-transparent group-hover:text-emerald-500" />
                  </button>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
                      {assignment.course}
                    </p>
                    
                    {/* Due Date Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: status.bg, color: status.text }}
                      >
                        <HiOutlineClock className="w-3 h-3" />
                        {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
