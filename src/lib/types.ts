export type Category =
  | 'Academic'
  | 'Placement'
  | 'Events'
  | 'Scholarships'
  | 'Sports'
  | 'Hostel'
  | 'General';

export type Urgency = 'Normal' | 'Important' | 'Urgent';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: Category;
  tags: string[]; // e.g. ["BBA-4", "BCOM-3", "ALL"]
  urgency: Urgency;
  postedBy: string;
  postedAt: Date;
  expiryDate: Date;
  isPinned: boolean;
  attachmentUrl: string | null;
  attachmentName: string | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  category: string; // "Exam", "Workshop", "Holiday", "Club", "Sports", "Deadline"
  date: Date;
  endDate?: Date;
  tags: string[];
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  course: string; // e.g. "Data Structures (CS301)"
  description: string;
  dueDate: Date;
  tags: string[];
  isCompleted?: boolean;
  postedBy: string;
  postedAt: Date;
}

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  department: string;
  year: number;
  courses: string[];
  isAdmin: boolean;
  tags: string[]; // auto-computed: ["CSE-3", "ALL"]
  subscribedCategories: string[];
  fcmToken: string | null;
  readNotices?: string[];
  completedAssignments?: string[];
  role?: 'student' | 'admin';
}

export interface NoticeFormData {
  title: string;
  body: string;
  category: Category;
  tags: string[];
  urgency: Urgency;
  expiryDate: string;
  isPinned: boolean;
  postedBy: string;
  attachmentUrl: string;
  attachmentName: string;
}
