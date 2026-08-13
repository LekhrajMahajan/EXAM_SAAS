import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_SESSIONS } from '../utils/placeholder';
import { StatusBadge } from '../components/StatusBadge';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OfflineSessionsPage() {
  const [search, setSearch] = useState('');
  const filtered = DUMMY_SESSIONS.filter(s =>
    s.exam.toLowerCase().includes(search.toLowerCase()) ||
    s.sessionCode.toLowerCase().includes(search.toLowerCase()) ||
    s.center.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Offline Sessions" description="Manage all offline examination sessions, centers, and capacity details." />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search by exam, session code, center..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Statuses</option>
          <option>Scheduled</option><option>Running</option><option>Completed</option><option>Cancelled</option>
        </select>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Shifts</option>
          <option>Morning</option><option>Afternoon</option><option>Evening</option>
        </select>
        <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2" /> More Filters</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-mono text-xs font-bold text-indigo-700">{s.sessionCode}</div>
                <div className="font-bold text-slate-900 mt-1">{s.exam}</div>
                <div className="text-sm text-slate-500">{s.subject}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{s.center}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.startTime} – {s.endTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.totalCandidates} candidates</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-slate-500">
                {new Date(s.date).toLocaleDateString()} · {s.shift} Shift · {s.roomCount} Rooms
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600" asChild>
                  <Link to="/company/offline-exam/attendance">Attendance</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600" asChild>
                  <Link to="/company/offline-exam/seating-plan">Seating</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
