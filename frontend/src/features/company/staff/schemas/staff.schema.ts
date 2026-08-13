import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email format'),
  role: z.string().min(1, 'Role is required'),
  state: z.string().optional(),
  city: z.string().optional(),
  examId: z.string().optional(),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

