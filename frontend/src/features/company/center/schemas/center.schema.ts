import { z } from 'zod';

export const centerSchema = z.object({
  centerName: z.string().min(1, 'Center Name is required'),
  centerCode: z.string().min(1, 'Center Code is required'),
  branch: z.string().optional(),
  centerType: z.string().min(1, 'Center Type is required').default('Standard Center'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  googleMapUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  
  headName: z.string().min(1, 'Center Head Name is required'),
  headEmail: z.string().email('Invalid email format'),
  headMobile: z.string().min(10, 'Invalid mobile number'),
  emergencyContact: z.string().optional(),
  
  maxCandidates: z.coerce.number().min(1, 'Capacity must be at least 1'),
  maxRooms: z.coerce.number().min(1, 'Rooms must be at least 1'),
  maxSystems: z.coerce.number().min(1, 'Systems must be at least 1'),
  
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export type CenterFormValues = z.infer<typeof centerSchema>;
