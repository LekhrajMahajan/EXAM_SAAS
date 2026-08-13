import { z } from 'zod';

export const verificationChecklistSchema = z.object({
  admitCardVerified: z.boolean().refine(val => val === true, 'Admit card must be verified'),
  photoMatched: z.boolean().refine(val => val === true, 'Photo must match candidate'),
  identityVerified: z.boolean().refine(val => val === true, 'Identity proof must be verified'),
  documentVerified: z.boolean().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Verified', 'Rejected', 'Hold']),
});

export type VerificationChecklist = z.infer<typeof verificationChecklistSchema>;

export const searchCandidateSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  searchType: z.enum(['application', 'admitCard', 'aadhaar']).default('application'),
});
