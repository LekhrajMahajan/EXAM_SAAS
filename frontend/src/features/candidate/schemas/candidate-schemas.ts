import { z } from 'zod';

export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject is required and must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
});

export type SupportTicketForm = z.infer<typeof supportTicketSchema>;

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  pincode: z.string().min(5, 'Invalid pincode'),
});

export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;
