'use client';
import { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import CategoryPill from './CategoryPill';
import { useRef, useState, useEffect } from 'react';

interface Props {
  selected: Category | 'All';
  onSelect: (cat: Category | 'All') => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className="relative w-full">
      {/* Left fade */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--surface-primary)] to-transparent z-10 pointer-events-none" />
      )}
      {/* Right fade */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--surface-primary)] to-transparent z-10 pointer-events-none" />
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2.5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-hide -mx-1 snap-x scroll-smooth touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="snap-start shrink-0">
          <CategoryPill category="All" active={selected === 'All'} onClick={() => onSelect('All')} />
        </div>
        {CATEGORIES.map((cat) => (
          <div key={cat} className="snap-start shrink-0">
            <CategoryPill category={cat} active={selected === cat} onClick={() => onSelect(cat)} />
          </div>
        ))}
      </div>
    </div>
  );
}
