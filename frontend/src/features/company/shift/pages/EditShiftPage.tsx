import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ShiftForm } from '../components/ShiftForm';
import { DUMMY_SHIFTS } from '../utils/placeholder';

export function EditShiftPage() {
  const { id } = useParams<{ id: string }>();
  const shift = DUMMY_SHIFTS.find(s => s.id === id);

  if (!shift) {
    return <Navigate to="/company/shifts" replace />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title={`Edit Shift: ${shift.general.code}`} 
        description="Modify shift details, scheduling, and capacity." 
      />
      <ShiftForm initialData={shift} />
    </div>
  );
}
