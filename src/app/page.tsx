'use client';

import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import NoticeWidget from '@/components/dashboard/NoticeWidget';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import AssignmentsWidget from '@/components/dashboard/AssignmentsWidget';

export default function Dashboard() {
  return (
    <div className="animate-fadeInUp space-y-6">
      <WelcomeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Notices) */}
        <div className="lg:col-span-2 space-y-6 min-w-0 overflow-hidden">
          <NoticeWidget />
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6 min-w-0">
          <CalendarWidget />
          <AssignmentsWidget />
        </div>
      </div>
    </div>
  );
}
