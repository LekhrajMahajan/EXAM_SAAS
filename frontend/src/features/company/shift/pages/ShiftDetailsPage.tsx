import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DUMMY_SHIFTS } from '../utils/placeholder';
import { ShiftHeader } from '../components/ShiftHeader';
import { TimelineCard } from '../components/TimelineCard';
import { CapacityCard } from '../components/CapacityCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { MapPin, Info } from 'lucide-react';

export function ShiftDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const shift = DUMMY_SHIFTS.find(s => s.id === id);

  if (!shift) {
    return <Navigate to="/company/shifts" replace />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ShiftHeader shift={shift} activeTab="details" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                General Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Exam</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{shift.general.examId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Shift Name</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{shift.general.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Late Entry Rules</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {shift.schedule.lateEntryAllowed 
                      ? `Allowed up to ${shift.schedule.lateEntryDuration} minutes` 
                      : 'Not Allowed (Strict Gate Closing)'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Location details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Branch</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{shift.general.branchId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Center</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{shift.general.centerId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">State</dt>
                  <dd className="mt-1 text-sm text-slate-900">{shift.general.stateId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">City</dt>
                  <dd className="mt-1 text-sm text-slate-900">{shift.general.cityId}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TimelineCard schedule={shift.schedule} />
          <CapacityCard shift={shift} />
        </div>
      </div>
    </div>
  );
}
