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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center border border-[var(--border-primary)]">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        <div className="w-full md:w-64">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <PinnedSection notices={pinnedNotices} />

      <section>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Latest Updates
        </h2>
        {notices.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[var(--border-primary)]">
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
