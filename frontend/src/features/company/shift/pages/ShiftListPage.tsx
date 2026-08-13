import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ShiftTable } from '../components/ShiftTable';
import { StatisticsCard } from '../components/StatisticsCard';
import { DUMMY_SHIFTS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Plus, Search, Calendar, Users, FileText, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ShiftListPage() {
  const upcomingCount = DUMMY_SHIFTS.filter(s => s.status === 'Upcoming').length;
  const completedCount = DUMMY_SHIFTS.filter(s => s.status === 'Completed').length;
  const totalCapacity = DUMMY_SHIFTS.reduce((acc, s) => acc + s.capacity.maxCapacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Shift Management" 
          description="Manage exam shifts, scheduling, and capacity planning." 
        />
        <Link to="/company/shifts/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Shift
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard 
          title="Total Shifts" 
          value={DUMMY_SHIFTS.length} 
          icon={<FileText className="w-5 h-5" />} 
          colorClass="border-blue-500"
        />
        <StatisticsCard 
          title="Upcoming Shifts" 
          value={upcomingCount} 
          icon={<Calendar className="w-5 h-5" />} 
          colorClass="border-amber-500"
        />
        <StatisticsCard 
          title="Total Capacity" 
          value={totalCapacity} 
          icon={<Users className="w-5 h-5" />} 
          colorClass="border-indigo-500"
        />
        <StatisticsCard 
          title="Completed" 
          value={completedCount} 
          icon={<XCircle className="w-5 h-5 text-slate-400" />} 
          colorClass="border-green-500"
        />
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search shifts by name, code, or exam..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <ShiftTable shifts={DUMMY_SHIFTS} />
    </div>
  );
}
