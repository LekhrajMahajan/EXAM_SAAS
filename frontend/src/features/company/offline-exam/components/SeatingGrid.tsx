import React from 'react';
import type { SeatAllocation } from '../types';

export function SeatingGrid({ seats }: { seats: SeatAllocation[] }) {
  const rooms = [...new Set(seats.map(s => s.room))];

  return (
    <div className="space-y-6">
      {rooms.map(room => {
        const roomSeats = seats.filter(s => s.room === room);
        const floor = roomSeats[0]?.floor ?? '';
        const building = roomSeats[0]?.building ?? '';

        return (
          <div key={room} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">{room}</h3>
                <p className="text-xs text-slate-500">{building} — {floor}</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"></span> Occupied ({roomSeats.filter(s => s.isOccupied).length})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-300 inline-block"></span> Vacant ({roomSeats.filter(s => !s.isOccupied).length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {roomSeats.map(seat => (
                <div
                  key={seat.id}
                  className={`rounded-lg p-3 border transition-colors ${seat.isOccupied ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-700">{seat.seatNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${seat.isOccupied ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{seat.candidateName}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{seat.rollNumber}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
