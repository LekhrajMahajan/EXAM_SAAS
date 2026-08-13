import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Wand2, Users, LayoutGrid } from 'lucide-react';
import { Switch } from '@/shared/components/ui/switch';

export function SeatAllocationCard() {
  const [isAuto, setIsAuto] = useState(true);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-600" />
            Room & Seat Allocation
          </CardTitle>
          <CardDescription>Assign specific rooms and seat mappings</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-alloc" className="text-sm font-medium cursor-pointer">Auto Allocation</Label>
          <Switch id="auto-alloc" checked={isAuto} onCheckedChange={setIsAuto} />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>Select Room</Label>
          <Select defaultValue="rm-1">
            <SelectTrigger>
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rm-1">Room 101 (Capacity: 50)</SelectItem>
              <SelectItem value="rm-2">Room 102 (Capacity: 30)</SelectItem>
              <SelectItem value="rm-3">Hall A (Capacity: 200)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isAuto ? (
          <div className="bg-indigo-50 border border-indigo-100 rounded-md p-6 text-center space-y-3">
            <Wand2 className="w-8 h-8 text-indigo-500 mx-auto" />
            <h4 className="font-medium text-indigo-900">Automatic Seat Mapping Enabled</h4>
            <p className="text-sm text-indigo-700 max-w-sm mx-auto">
              The system will sequentially assign seats to the selected candidates based on the room's seating layout pattern.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              Manual Mapping (Simulated)
            </h4>
            <div className="p-4 border border-slate-200 rounded-md bg-slate-50 text-center text-sm text-slate-500">
              Manual mapping UI placeholder. In a full implementation, this would render a grid representing the room layout where you can drag and drop candidates.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
