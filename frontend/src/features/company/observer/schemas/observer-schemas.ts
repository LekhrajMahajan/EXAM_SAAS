import { z } from 'zod';

export const dutyAllocationSchema = z.object({
  staffId: z.string().min(1, 'Staff member is required'),
  role: z.enum(['Observer', 'Invigilator']),
  examId: z.string().min(1, 'Exam is required'),
  centerId: z.string().min(1, 'Center is required'),
  building: z.string().optional(),
  floor: z.string().optional(),
  room: z.string().optional(),
  shiftId: z.string().min(1, 'Shift is required'),
  date: z.string().min(1, 'Date is required'),
});
export type DutyAllocationForm = z.infer<typeof dutyAllocationSchema>;

export const incidentReportSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  centerId: z.string().min(1, 'Center is required'),
  roomId: z.string().optional(),
});
export type IncidentReportForm = z.infer<typeof incidentReportSchema>;

export const violationReportSchema = z.object({
  candidateRollNo: z.string().min(1, 'Candidate Roll Number is required'),
  violationType: z.string().min(1, 'Violation Type is required'),
  actionTaken: z.enum(['Warning', 'Dismissed', 'Debarred', 'Under Review']),
  remarks: z.string().optional(),
  centerId: z.string().min(1, 'Center is required'),
  roomId: z.string().min(1, 'Room is required'),
});
export type ViolationReportForm = z.infer<typeof violationReportSchema>;
