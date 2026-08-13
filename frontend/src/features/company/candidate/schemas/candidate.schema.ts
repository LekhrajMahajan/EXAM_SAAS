import { z } from 'zod';

const educationSchema = z.object({
  qualification: z.string().min(1, 'Qualification is required'),
  boardUniversity: z.string().min(1, 'Board/University is required'),
  passingYear: z.string().regex(/^\d{4}$/, 'Invalid year format'),
  percentage: z.string().min(1, 'Percentage is required'),
});

export const candidateSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS']),
  nationality: z.string().min(1, 'Nationality is required'),
  
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  panNumber: z.string().optional().or(z.literal('')),
  passportNumber: z.string().optional().or(z.literal('')),
  
  mobile: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid mobile number'),
  email: z.string().email('Invalid email format'),
  emergencyContact: z.string().min(10, 'Invalid emergency contact'),
  
  currentAddress: z.string().min(1, 'Current Address is required'),
  permanentAddress: z.string().min(1, 'Permanent Address is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  
  education: z.array(educationSchema).min(1, 'At least one education record is required'),
  
  status: z.enum(['Draft', 'Submitted', 'Approved', 'Rejected']).default('Draft'),
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;
