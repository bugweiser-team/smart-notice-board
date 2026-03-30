'use client';

import { useState, useEffect, useMemo } from 'react';
import { Notice, Category } from '@/lib/types';
import { SEED_NOTICES } from '@/lib/seedData';
import { isExpired } from '@/lib/utils';

// Generate stable IDs for seed data
function getSeededNotices(): Notice[] {
  return SEED_NOTICES.map((notice, index) => ({
    ...notice,
    id: `seed-${index + 1}`,
  }));
}

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!apiKey) {
      // No Firebase — use local seed data
      const seeded = getSeededNotices();
      setNotices(seeded);
      setLoading(false);
      return;
    }

    // Firebase configured — use real-time listener WITH new-notice detection
    import('@/lib/firestore').then(({ onNoticesSnapshotWithChanges }) => {
      const unsubscribe = onNoticesSnapshotWithChanges(
        (firebaseNotices) => {
          setNotices(firebaseNotices);
          setLoading(false);
        },
        (newNotice) => {
          // 🔔 Play notification sound
          try {
            const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
          } catch {}

          // 🔔 Show browser notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`📋 ${newNotice.title}`, {
              body: newNotice.body.slice(0, 120),
              icon: '/favicon.ico',
              tag: newNotice.id,
            });
          }

          // 🔔 Show in-page toast
          if (typeof window !== 'undefined') {
            const toast = document.createElement('div');
            toast.id = 'live-notice-toast';
            toast.innerHTML = `
              <div style="position:fixed;top:70px;right:16px;z-index:9999;max-width:360px;width:calc(100% - 32px);background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;border-radius:16px;padding:16px 20px;box-shadow:0 8px 32px rgba(79,70,229,0.4);animation:slideDown 300ms ease-out;font-family:Inter,sans-serif;">
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <span style="font-size:24px;flex-shrink:0;">🔔</span>
                  <div style="min-width:0;">
                    <p style="font-weight:800;font-size:13px;margin:0 0 4px 0;opacity:0.85;">NEW NOTICE</p>
                    <p style="font-weight:700;font-size:14px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${newNotice.title}</p>
                    <p style="font-size:12px;margin:4px 0 0 0;opacity:0.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${newNotice.body.slice(0, 80)}</p>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
          }
        },
        (error) => {
          console.error("Firebase connection blocked:", error);
          setNotices(getSeededNotices());
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }).catch(() => {
      // Fallback to seed data on error
      setNotices(getSeededNotices());
      setLoading(false);
    });
  }, []);

  // Active notices (not expired)
  const activeNotices = useMemo(
    () => notices.filter((n) => !isExpired(n.expiryDate)),
    [notices]
  );

  // Archived notices (expired)
  const archivedNotices = useMemo(
    () => notices.filter((n) => isExpired(n.expiryDate)),
    [notices]
  );

  // Pinned notices (from active, not expired)
  const pinnedNotices = useMemo(
    () => activeNotices.filter((n) => n.isPinned).slice(0, 3),
    [activeNotices]
  );

  // Filter + search
  const filteredNotices = useMemo(() => {
    let result = activeNotices.filter((n) => !n.isPinned || selectedCategory !== 'All');

    if (selectedCategory !== 'All') {
      result = activeNotices.filter((n) => n.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }, [activeNotices, selectedCategory, searchQuery]);

  // Filter archived notices too
  const filteredArchivedNotices = useMemo(() => {
    let result = archivedNotices;

    if (selectedCategory !== 'All') {
      result = result.filter((n) => n.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }, [archivedNotices, selectedCategory, searchQuery]);

  // Add a notice locally (for demo without Firebase)
  const addNoticeLocally = (notice: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `local-${Date.now()}`,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  // Delete a notice locally
  const deleteNoticeLocally = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Update a notice locally
  const updateNoticeLocally = (id: string, updates: Partial<Notice>) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  // Get a single notice by ID
  const getNoticeById = (id: string): Notice | undefined => {
    return notices.find((n) => n.id === id);
  };

  return {
    notices,
    activeNotices,
    archivedNotices,
    pinnedNotices,
    filteredNotices,
    filteredArchivedNotices,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addNoticeLocally,
    deleteNoticeLocally,
    updateNoticeLocally,
    getNoticeById,
  };
}
