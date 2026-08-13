import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Users, UserPlus, UserCheck, ShieldAlert } from 'lucide-react';
import type { Shift } from '../types';

interface CapacityCardProps {
  shift: Shift;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ shift }) => {
  const { maxCapacity, expectedCandidates, reservedSeats } = shift.capacity;
  const { assignedCandidates } = shift;
  
  const totalOccupied = assignedCandidates + reservedSeats;
  const occupancyPercentage = maxCapacity > 0 ? (totalOccupied / maxCapacity) * 100 : 0;
  const remainingCapacity = Math.max(0, maxCapacity - totalOccupied);

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Capacity Dashboard
        </CardTitle>
        <CardDescription>Live overview of seat allocations for this shift.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Overall Occupancy</p>
              <p className="text-2xl font-bold text-slate-800">{occupancyPercentage.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{totalOccupied} / {maxCapacity}</p>
              <p className="text-xs text-slate-500">Seats filled</p>
            </div>
          </div>
          <Progress value={occupancyPercentage} className={`h-3 ${occupancyPercentage > 90 ? 'bg-red-100 [&>div]:bg-red-600' : 'bg-blue-100 [&>div]:bg-blue-600'}`} />
          {occupancyPercentage > 90 && (
            <p className="text-xs text-red-600 flex items-center mt-2 font-medium">
              <ShieldAlert className="w-3 h-3 mr-1" /> Approaching maximum capacity.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 flex items-center">
              <Users className="w-3 h-3 mr-1 text-slate-400" /> Total Capacity
            </p>
            <p className="text-lg font-bold text-slate-700">{maxCapacity}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 flex items-center">
              <UserCheck className="w-3 h-3 mr-1 text-green-500" /> Assigned
            </p>
            <p className="text-lg font-bold text-slate-700">{assignedCandidates}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 flex items-center">
              <UserPlus className="w-3 h-3 mr-1 text-amber-500" /> Reserved
            </p>
            <p className="text-lg font-bold text-slate-700">{reservedSeats}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 flex items-center">
              <ShieldAlert className="w-3 h-3 mr-1 text-blue-500" /> Available
            </p>
            <p className="text-lg font-bold text-slate-700">{remainingCapacity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
