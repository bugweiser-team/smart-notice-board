'use client';

import { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import CategoryPill from './CategoryPill';

interface Props {
  selected: Category | 'All';
  onSelect: (cat: Category | 'All') => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-0.5 scrollbar-hide -mx-0.5 snap-x">
      <div className="snap-start shrink-0">
        <CategoryPill category="All" active={selected === 'All'} onClick={() => onSelect('All')} />
      </div>
      {CATEGORIES.map((cat) => (
        <div key={cat} className="snap-start shrink-0">
          <CategoryPill category={cat} active={selected === cat} onClick={() => onSelect(cat)} />
        </div>
      ))}
    </div>
  );
}
