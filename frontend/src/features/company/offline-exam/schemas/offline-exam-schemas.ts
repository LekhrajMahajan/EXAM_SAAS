import { z } from 'zod';

export const attendanceMarkSchema = z.object({
  candidateId: z.string().min(1, 'Candidate ID is required'),
  status: z.enum(['Present', 'Absent', 'Late']),
  remarks: z.string().optional(),
});
export type AttendanceMarkForm = z.infer<typeof attendanceMarkSchema>;

export const seatAllocationSchema = z.object({
  sessionId: z.string().min(1, 'Session is required'),
  building: z.string().min(1, 'Building is required'),
  floor: z.string().min(1, 'Floor is required'),
  room: z.string().min(1, 'Room is required'),
  seatsPerRow: z.number().min(1).max(20),
  totalRows: z.number().min(1).max(50),
});
export type SeatAllocationForm = z.infer<typeof seatAllocationSchema>;

export const evaluationEntrySchema = z.object({
  sheetId: z.string().min(1, 'Sheet ID is required'),
  marksObtained: z.number().min(0, 'Marks cannot be negative'),
  remarks: z.string().optional(),
  evaluatorRemarks: z.string().optional(),
});
export type EvaluationEntryForm = z.infer<typeof evaluationEntrySchema>;

export const omrBatchSchema = z.object({
  sessionId: z.string().min(1, 'Session is required'),
  batchCode: z.string().min(1, 'Batch code is required'),
  totalSheets: z.number().min(1, 'Must have at least 1 sheet'),
  scanDate: z.string().min(1, 'Scan date is required'),
});
export type OmrBatchForm = z.infer<typeof omrBatchSchema>;
