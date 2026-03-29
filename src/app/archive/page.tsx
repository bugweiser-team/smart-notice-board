'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notice } from '@/lib/types';
import NoticeCard from '@/components/NoticeCard';

export default function ArchivePage() {
  const [archived, setArchived] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArchived() {
      try {
        const q = query(
          collection(db, 'notices'),
          where('expiryDate', '<', new Date()),
          orderBy('expiryDate', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            postedAt: d.postedAt?.toDate?.() || new Date(d.postedAt),
            expiryDate: d.expiryDate?.toDate?.() || new Date(d.expiryDate)
          } as Notice;
        });
        setArchived(data);
      } catch (err) {
        console.error("Failed to fetch archive:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArchived();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold pb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Notice Archive
      </h1>
      <p className="text-slate-500 mb-8 font-medium">View expired and past notices.</p>
      
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : archived.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-[var(--border-primary)]">
          <div className="text-5xl mb-4">🗄️</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Archive is empty</h2>
          <p className="text-slate-500 mt-2">No notices have expired yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {archived.map((notice, i) => (
            <div key={notice.id} className="opacity-75 hover:opacity-100 transition-opacity grayscale-[30%] hover:grayscale-0">
              <NoticeCard notice={notice} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
