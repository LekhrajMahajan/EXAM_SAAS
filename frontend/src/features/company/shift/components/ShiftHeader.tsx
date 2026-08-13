import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Edit, CalendarDays, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionBadge } from './SessionBadge';
import type { Shift } from '../types';

interface ShiftHeaderProps {
  shift: Shift;
  activeTab?: 'details' | 'calendar' | 'capacity';
}

export const ShiftHeader: React.FC<ShiftHeaderProps> = ({ shift, activeTab = 'details' }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Upcoming': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/company/shifts')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{shift.general.name}</h1>
              <Badge variant="outline" className={`${getStatusColor(shift.status)}`}>
                {shift.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">
                {shift.general.code}
              </span>
              <span>•</span>
              <span>{shift.general.examId}</span>
              <span>•</span>
              <span>{new Date(shift.schedule.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SessionBadge session={shift.schedule.session} />
          <Link to={`/company/shifts/${shift.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Shift
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200">
        <Link to={`/company/shifts/${shift.id}`}>
          <div className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            Overview
          </div>
        </Link>
        <Link to={`/company/shifts/${shift.id}/calendar`}>
          <div className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'calendar' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            <CalendarDays className="w-4 h-4" /> Calendar
          </div>
        </Link>
        <Link to={`/company/shifts/${shift.id}/capacity`}>
          <div className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'capacity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            <Users className="w-4 h-4" /> Capacity
          </div>
        </Link>
      </div>
    </div>
  );
};
