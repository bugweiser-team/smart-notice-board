'use client';

import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import NoticeWidget from '@/components/dashboard/NoticeWidget';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import AssignmentsWidget from '@/components/dashboard/AssignmentsWidget';

export default function Dashboard() {
  return (
    <div className="animate-fadeInUp">
      <WelcomeBanner />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Notices) - Takes 2 columns on xl */}
        <div className="xl:col-span-2">
          <NoticeWidget />
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          <CalendarWidget />
          <AssignmentsWidget />
        </div>
      </div>
    </div>
  );
}
