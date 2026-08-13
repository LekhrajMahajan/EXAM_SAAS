import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DUMMY_SHIFTS } from '../utils/placeholder';
import { ShiftHeader } from '../components/ShiftHeader';
import { CapacityCard } from '../components/CapacityCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Settings, Plus, Minus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function CapacityManagementPage() {
  const { id } = useParams<{ id: string }>();
  const shift = DUMMY_SHIFTS.find(s => s.id === id);

  if (!shift) {
    return <Navigate to="/company/shifts" replace />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ShiftHeader shift={shift} activeTab="capacity" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapacityCard shift={shift} />

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" />
              Adjust Capacity Limits
            </CardTitle>
            <CardDescription>Update the maximum and reserved capacity configurations.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Maximum Capacity (Total Seats)</Label>
                <div className="flex gap-2 max-w-[200px]">
                  <Button variant="outline" size="icon"><Minus className="w-4 h-4" /></Button>
                  <Input id="maxCapacity" defaultValue={shift.capacity.maxCapacity} className="text-center font-bold" />
                  <Button variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reservedSeats">Reserved Seats (Buffer)</Label>
                <div className="flex gap-2 max-w-[200px]">
                  <Button variant="outline" size="icon"><Minus className="w-4 h-4" /></Button>
                  <Input id="reservedSeats" defaultValue={shift.capacity.reservedSeats} className="text-center font-bold" />
                  <Button variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <Button className="w-full sm:w-auto">Save Capacity Configuration</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
