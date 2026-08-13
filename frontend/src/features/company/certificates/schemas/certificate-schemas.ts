import { z } from 'zod';

export const generateCertificateSchema = z.object({
  exam: z.string().min(1, 'Please select an exam'),
  certificateType: z.string().min(1, 'Please select a certificate type'),
  sourceData: z.enum(['Result List', 'Merit List']),
  templateId: z.string().min(1, 'Please select a template'),
  includeDigitalSignature: z.boolean().optional(),
  includeQrCode: z.boolean().optional(),
  includeWatermark: z.boolean().optional(),
});

export type GenerateCertificateForm = z.infer<typeof generateCertificateSchema>;

export const verifyCertificateSchema = z.object({
  certificateNumber: z.string().min(1, 'Certificate number is required'),
});

export type VerifyCertificateForm = z.infer<typeof verifyCertificateSchema>;
