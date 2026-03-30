import { Category, Urgency } from './types';

export const CATEGORIES: Category[] = [
  'Academic',
  'Placement',
  'Events',
  'Scholarships',
  'Sports',
  'Hostel',
  'General',
];

// New pastel-based color system matching reference designs
export const CATEGORY_COLORS: Record<Category, { 
  bg: string; 
  text: string; 
  accent: string; 
  border: string; 
  icon: string; 
  darkBg: string; 
  darkText: string; 
  darkBorder: string;
  iconBg: string;
}> = {
  Academic: {
    bg: '#FADCD9',          // Soft pink
    text: '#9F1239',        // Deep rose
    accent: '#E11D48',      // Rose-500
    border: '#FECDD3',      // Rose-200
    icon: 'academic',
    iconBg: '#FEE2E2',
    darkBg: '#3D2A2A',
    darkText: '#FCA5A5',
    darkBorder: '#7F1D1D',
  },
  Placement: {
    bg: '#D4F5E4',          // Soft mint
    text: '#166534',        // Green-800
    accent: '#22C55E',      // Green-500
    border: '#BBF7D0',      // Green-200
    icon: 'briefcase',
    iconBg: '#DCFCE7',
    darkBg: '#1E3A2E',
    darkText: '#86EFAC',
    darkBorder: '#166534',
  },
  Events: {
    bg: '#FBE8D3',          // Soft peach
    text: '#9A3412',        // Orange-800
    accent: '#F97316',      // Orange-500
    border: '#FED7AA',      // Orange-200
    icon: 'calendar',
    iconBg: '#FFEDD5',
    darkBg: '#3D3328',
    darkText: '#FDBA74',
    darkBorder: '#9A3412',
  },
  Scholarships: {
    bg: '#E8DDF5',          // Soft lavender
    text: '#6B21A8',        // Purple-800
    accent: '#A855F7',      // Purple-500
    border: '#E9D5FF',      // Purple-200
    icon: 'graduation',
    iconBg: '#F3E8FF',
    darkBg: '#2D2840',
    darkText: '#D8B4FE',
    darkBorder: '#6B21A8',
  },
  Sports: {
    bg: '#FEF9C3',          // Soft yellow
    text: '#A16207',        // Yellow-700
    accent: '#EAB308',      // Yellow-500
    border: '#FEF08A',      // Yellow-200
    icon: 'sports',
    iconBg: '#FEF9C3',
    darkBg: '#3D3A1E',
    darkText: '#FDE047',
    darkBorder: '#A16207',
  },
  Hostel: {
    bg: '#CFFAFE',          // Soft cyan
    text: '#155E75',        // Cyan-800
    accent: '#06B6D4',      // Cyan-500
    border: '#A5F3FC',      // Cyan-200
    icon: 'home',
    iconBg: '#ECFEFF',
    darkBg: '#134152',
    darkText: '#67E8F9',
    darkBorder: '#155E75',
  },
  General: {
    bg: '#F3F4F6',          // Soft gray
    text: '#374151',        // Gray-700
    accent: '#6B7280',      // Gray-500
    border: '#E5E7EB',      // Gray-200
    icon: 'bell',
    iconBg: '#F9FAFB',
    darkBg: '#374155',
    darkText: '#D1D5DB',
    darkBorder: '#4B5563',
  },
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Academic: 'academic',
  Placement: 'briefcase',
  Events: 'calendar',
  Scholarships: 'graduation',
  Sports: 'sports',
  Hostel: 'home',
  General: 'bell',
};

export const URGENCY_STYLES: Record<Urgency, { 
  bg: string; 
  text: string; 
  border: string; 
  dot: string; 
  label: string; 
  icon: string; 
  darkBg: string; 
  darkText: string; 
  darkBorder: string 
}> = {
  Urgent: {
    bg: '#FEE2E2',
    text: '#DC2626',
    border: '#FECACA',
    dot: '#EF4444',
    label: 'Urgent',
    icon: 'alert',
    darkBg: 'rgba(239, 68, 68, 0.15)',
    darkText: '#FCA5A5',
    darkBorder: 'rgba(239, 68, 68, 0.25)',
  },
  Important: {
    bg: '#FEF3C7',
    text: '#D97706',
    border: '#FDE68A',
    dot: '#F59E0B',
    label: 'Important',
    icon: 'star',
    darkBg: 'rgba(245, 158, 11, 0.15)',
    darkText: '#FCD34D',
    darkBorder: 'rgba(245, 158, 11, 0.25)',
  },
  Normal: {
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#E5E7EB',
    dot: '#9CA3AF',
    label: 'Normal',
    icon: '',
    darkBg: 'rgba(107, 114, 128, 0.15)',
    darkText: '#9CA3AF',
    darkBorder: 'rgba(107, 114, 128, 0.25)',
  },
};
