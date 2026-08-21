import { z } from 'zod';

export const shiftGeneralSchema = z.object({
  name: z.string().min(3, 'Shift name must be at least 3 characters'),
  code: z.string().min(2, 'Shift code must be at least 2 characters'),
  examId: z.string().min(1, 'Exam is required'),

  centerId: z.string().min(1, 'Center is required'),
  stateId: z.string().min(1, 'State is required'),
  cityId: z.string().min(1, 'City is required'),
});

export const shiftScheduleSchema = z.object({
  date: z.string().min(1, 'Exam date is required'),
  reportingTime: z.string().min(1, 'Reporting time is required'),
  gateClosingTime: z.string().min(1, 'Gate closing time is required'),
  examStartTime: z.string().min(1, 'Exam start time is required'),
  examEndTime: z.string().min(1, 'Exam end time is required'),
  lateEntryAllowed: z.boolean().default(false),
  lateEntryDuration: z.number().min(0).optional(),
  session: z.enum(['Morning', 'Afternoon', 'Evening', 'Custom']),
});

export const shiftCapacitySchema = z.object({
  maxCapacity: z.number().min(1, 'Maximum capacity must be at least 1'),
  reservedSeats: z.number().min(0, 'Reserved seats cannot be negative').default(0),
  expectedCandidates: z.number().min(0, 'Expected candidates cannot be negative').default(0),
});

export const shiftSchema = z.object({
  id: z.string(),
  general: shiftGeneralSchema,
  schedule: shiftScheduleSchema,
  capacity: shiftCapacitySchema,
  status: z.enum(['Draft', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled']),
  assignedCandidates: z.number().min(0).default(0),
});
