'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notice } from '@/lib/types';
import NoticeCard from '@/components/NoticeCard';
import { HiOutlineArchive, HiOutlineSearch } from 'react-icons/hi';

export default function ArchivePage() {
  const [archived, setArchived] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredArchived = archived.filter(notice => 
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Notice Archive
          </h1>
          <p className="text-[var(--text-secondary)]">
            View expired and past notices.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center">
            <HiOutlineSearch className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive..."
            className="w-full h-12 pl-14 pr-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 transition-all"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-[var(--accent-lime)] border-t-transparent animate-spin" />
            <p className="text-sm text-[var(--text-tertiary)] font-medium">Loading archive...</p>
          </div>
        </div>
      ) : filteredArchived.length === 0 ? (
        <div className="bg-[var(--surface-secondary)] rounded-[24px] p-16 text-center border border-[var(--border-primary)]">
          <div className="w-20 h-20 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center mx-auto mb-4">
            <HiOutlineArchive className="w-10 h-10 text-[var(--text-tertiary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {searchQuery ? 'No results found' : 'Archive is empty'}
          </h2>
          <p className="text-[var(--text-secondary)]">
            {searchQuery ? 'Try a different search term' : 'No notices have expired yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--text-tertiary)]">
              {filteredArchived.length} archived {filteredArchived.length === 1 ? 'notice' : 'notices'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredArchived.map((notice, i) => (
              <div 
                key={notice.id} 
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <NoticeCard notice={notice} index={i} showExpired />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
