'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import NoticeCard from '../NoticeCard';
import CategoryFilter from '../CategoryFilter';
import SearchBar from '../SearchBar';
import EmptyState from '../EmptyState';
import PinnedSection from '../PinnedSection';

export default function NoticeWidget() {
  const { 
    notices, 
    pinnedNotices, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useDashboardData();

  if (loading) {
    return (
      <div className="bg-[var(--surface-secondary)] rounded-[20px] p-8 h-96 flex items-center justify-center border border-[var(--border-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-[var(--accent-lime)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--text-tertiary)] font-medium">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        <div className="w-full lg:w-72">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Pinned Notices */}
      <PinnedSection notices={pinnedNotices} />

      {/* Latest Notices */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Latest Updates
          </h2>
          <span className="text-xs font-medium text-[var(--text-tertiary)] bg-[var(--surface-tertiary)] px-3 py-1.5 rounded-full">
            {notices.length} notices
          </span>
        </div>
        
        {notices.length === 0 ? (
          <div className="bg-[var(--surface-secondary)] rounded-[20px] border border-[var(--border-primary)]">
            <EmptyState 
              message="No notices found" 
              sub={searchQuery ? "Try a different search term" : "Check back later"} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice, i) => (
              <NoticeCard key={notice.id} notice={notice} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
