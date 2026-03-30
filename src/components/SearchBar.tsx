'use client';

import { HiSearch, HiX } from 'react-icons/hi';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search notices...', className = '' }: Props) {
  return (
    <div className={`relative w-full ${className} group`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] group-focus-within:bg-[var(--accent-lime)] flex items-center justify-center transition-colors">
        <HiSearch className="text-[var(--text-tertiary)] group-focus-within:text-[#1A1A2E] transition-colors text-[16px]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[48px] pl-14 pr-10 rounded-2xl border border-[var(--border-primary)] bg-white dark:bg-[var(--surface-secondary)] text-[14px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-lime)] focus:ring-2 focus:ring-[var(--accent-lime)]/20 hover:border-[var(--border-hover)] transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] transition-all cursor-pointer"
          aria-label="Clear search"
        >
          <HiX className="text-[14px]" />
        </button>
      )}
    </div>
  );
}
