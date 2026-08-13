import React from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import type { Shift } from '../types';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShiftFormProps {
  initialData?: Shift;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  // using basic controlled inputs for placeholder instead of full RHF to keep it simple for UI

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium text-slate-900 mb-6 pb-2 border-b">General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Shift Name</Label>
            <Input id="name" defaultValue={initialData?.general.name} placeholder="e.g. Morning Physics Shift" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Shift Code</Label>
            <Input id="code" defaultValue={initialData?.general.code} placeholder="e.g. SHF-PHY-M" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examId">Exam</Label>
            <Select defaultValue={initialData?.general.examId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics Final 2024">Physics Final 2024</SelectItem>
                <SelectItem value="Mathematics Final 2024">Mathematics Final 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="centerId">Center</Label>
            <Select defaultValue={initialData?.general.centerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Center A">Center A</SelectItem>
                <SelectItem value="Center B">Center B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium text-slate-900 mb-6 pb-2 border-b">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">Exam Date</Label>
            <Input id="date" type="date" defaultValue={initialData?.schedule.date} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session">Session</Label>
            <Select defaultValue={initialData?.schedule.session}>
              <SelectTrigger>
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reportingTime">Reporting Time</Label>
            <Input id="reportingTime" type="time" defaultValue={initialData?.schedule.reportingTime?.replace(/ AM| PM/, '')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gateClosingTime">Gate Closing Time</Label>
            <Input id="gateClosingTime" type="time" defaultValue={initialData?.schedule.gateClosingTime?.replace(/ AM| PM/, '')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examStartTime">Exam Start Time</Label>
            <Input id="examStartTime" type="time" defaultValue={initialData?.schedule.examStartTime?.replace(/ AM| PM/, '')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examEndTime">Exam End Time</Label>
            <Input id="examEndTime" type="time" defaultValue={initialData?.schedule.examEndTime?.replace(/ AM| PM/, '')} />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Switch id="lateEntry" defaultChecked={initialData?.schedule.lateEntryAllowed} />
          <Label htmlFor="lateEntry" className="font-normal">Allow late entry?</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button onClick={() => navigate('/company/shifts')}>
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};
