import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ROOMS } from '../utils/placeholder';
import { RoomCard } from '../components/RoomCard';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, UserPlus } from 'lucide-react';

export function RoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Room Assignments" description="Manage invigilator room allocations and capacity limits." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Bulk Assign Rooms
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search by center or room..." />
        </div>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Centers</option>
          <option>Delhi Centre 01</option>
          <option>Mumbai Centre 02</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option>All Shifts</option>
          <option>Morning</option>
          <option>Afternoon</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-md">
          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
          Unassigned Rooms Only
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DUMMY_ROOMS.map(room => <RoomCard key={room.id} room={room} />)}
      </div>
    </div>
  );
}
