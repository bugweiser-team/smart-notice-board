'use client';

import { useState, useEffect } from 'react';
import { Assignment } from '@/lib/types';
import { SEED_ASSIGNMENTS } from '@/lib/seedData';

function getSeededAssignments(): Assignment[] {
  return SEED_ASSIGNMENTS.map((evt, index) => ({
    ...evt,
    id: `assignment-${index + 1}`,
  }));
}

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!apiKey) {
      // No Firebase — use local seed data
      setAssignments(getSeededAssignments());
      setLoading(false);
      return;
    }

    // Firebase configured — use real-time listener
    import('@/lib/firestore').then(({ onAssignmentsSnapshot }) => {
      const unsubscribe = onAssignmentsSnapshot((firebaseAssignments) => {
        if (firebaseAssignments.length === 0) {
          // Fallback to seed data if collection is empty
          setAssignments(getSeededAssignments());
        } else {
          setAssignments(firebaseAssignments);
        }
        setLoading(false);
      }, (error) => {
        console.error("Assignments connection error:", error);
        setAssignments(getSeededAssignments());
        setLoading(false);
      });
      return () => unsubscribe();
    }).catch(() => {
      setAssignments(getSeededAssignments());
      setLoading(false);
    });
  }, []);

  return {
    assignments,
    loading,
  };
}
