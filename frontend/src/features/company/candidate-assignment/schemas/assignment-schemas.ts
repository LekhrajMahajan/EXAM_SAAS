import { z } from 'zod';

export const assignmentSelectionSchema = z.object({
  examId: z.string().min(1, 'Exam is required'),
  shiftId: z.string().min(1, 'Shift is required'),
  centerId: z.string().min(1, 'Center is required'),
  branchId: z.string().min(1, 'Branch is required'),
});

export const candidateSelectionSchema = z.object({
  candidateIds: z.array(z.string()).min(1, 'Select at least one candidate'),
});

export const roomAllocationSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  seatNumber: z.string().optional(),
});

export const importSchema = z.object({
  file: z.any().refine((val) => val !== null, 'File is required'),
});
