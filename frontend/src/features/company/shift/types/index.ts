import type { z } from 'zod';
import type {
  shiftGeneralSchema,
  shiftScheduleSchema,
  shiftCapacitySchema,
  shiftSchema,
} from '../schemas/shift-schemas';

export type ShiftGeneral = z.infer<typeof shiftGeneralSchema>;
export type ShiftSchedule = z.infer<typeof shiftScheduleSchema>;
export type ShiftCapacity = z.infer<typeof shiftCapacitySchema>;
export type Shift = z.infer<typeof shiftSchema>;
