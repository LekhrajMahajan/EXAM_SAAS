import React from 'react';
import type { RoomAssignment } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { MapPin, Users, UserSquare2 } from 'lucide-react';

export function RoomCard({ room }: { room: RoomAssignment }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" /> {room.room}
            </h3>
            <div className="text-xs text-slate-500 mt-1">{room.center} · {room.building}</div>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-700 border border-slate-100">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {room.capacity} cap
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Staff ({room.assignedStaff.length})</div>
          {room.assignedStaff.map((staff, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                <UserSquare2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{staff.name}</div>
                <div className="text-xs text-indigo-600 font-medium">{staff.role}</div>
              </div>
            </div>
          ))}
          {room.assignedStaff.length === 0 && (
            <div className="text-sm text-slate-400 italic py-2">No staff assigned yet</div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
          <span>{new Date(room.date).toLocaleDateString()}</span>
          <span className="font-bold text-slate-700">{room.shift}</span>
        </div>
      </CardContent>
    </Card>
  );
}
