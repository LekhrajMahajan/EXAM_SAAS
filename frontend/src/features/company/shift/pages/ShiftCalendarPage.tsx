import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DUMMY_SHIFTS } from '../utils/placeholder';
import { ShiftHeader } from '../components/ShiftHeader';
import { ShiftCalendar } from '../components/ShiftCalendar';

export function ShiftCalendarPage() {
  const { id } = useParams<{ id: string }>();
  const shift = DUMMY_SHIFTS.find(s => s.id === id);

  if (!shift) {
    return <Navigate to="/company/shifts" replace />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ShiftHeader shift={shift} activeTab="calendar" />
      <ShiftCalendar shifts={DUMMY_SHIFTS} />
    </div>
  );
}
