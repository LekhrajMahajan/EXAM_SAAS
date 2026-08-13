import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardCard } from '../components/DashboardCard';
import { Calendar, FileText, Ticket, Trophy, Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { DUMMY_NOTIFICATIONS } from '../utils/placeholder';
import { NotificationCard } from '../components/NotificationCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';

export function CandidateDashboardPage() {
  const unreadCount = DUMMY_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Welcome back, John!" 
          description="Here's a quick overview of your applications and upcoming exams." 
        />
        <Button asChild>
          <Link to="/candidate/application">View Applications</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Upcoming Exam"
          value="Aug 15"
          description="Spring Admissions Test 2026"
          icon={Calendar}
          iconClassName="text-indigo-600 bg-indigo-100"
        />
        <DashboardCard 
          title="Application Status"
          value="Approved"
          description="APP-2026-001"
          icon={FileText}
          iconClassName="text-emerald-600 bg-emerald-100"
        />
        <DashboardCard 
          title="Admit Card"
          value="Available"
          description="Ready to download"
          icon={Ticket}
          iconClassName="text-blue-600 bg-blue-100"
        />
        <DashboardCard 
          title="Latest Result"
          value="Pass"
          description="Winter Entrance Exam 2025"
          icon={Trophy}
          iconClassName="text-amber-600 bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
               <CardTitle className="text-lg">Recent Notifications</CardTitle>
               <Button variant="ghost" size="sm" asChild>
                 <Link to="/candidate/notifications">View All</Link>
               </Button>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                 {DUMMY_NOTIFICATIONS.map(notification => (
                   <NotificationCard key={notification.id} notification={notification} />
                 ))}
               </div>
             </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
               <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
               <Button variant="outline" className="w-full justify-start" asChild>
                 <Link to="/candidate/documents">
                   <FileText className="w-4 h-4 mr-2" /> Upload Documents
                 </Link>
               </Button>
               <Button variant="outline" className="w-full justify-start" asChild>
                 <Link to="/candidate/admit-card">
                   <Ticket className="w-4 h-4 mr-2" /> Download Admit Card
                 </Link>
               </Button>
               <Button variant="outline" className="w-full justify-start" asChild>
                 <Link to="/candidate/mock-test">
                   <Laptop className="w-4 h-4 mr-2" /> Take Mock Test
                 </Link>
               </Button>
               <Button variant="outline" className="w-full justify-start" asChild>
                 <Link to="/candidate/support">
                   <Bell className="w-4 h-4 mr-2" /> Raise Support Ticket
                 </Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Ensure Laptop icon is imported
import { Laptop } from 'lucide-react';
