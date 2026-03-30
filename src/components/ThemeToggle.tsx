'use client';

import { useTheme } from '@/context/ThemeContext';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] transition-all duration-200 active:scale-95 cursor-pointer"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <HiOutlineSun className="w-5 h-5 text-amber-500" />
      ) : (
        <HiOutlineMoon className="w-5 h-5 text-[var(--text-secondary)]" />
      )}
    </button>
  );
}
