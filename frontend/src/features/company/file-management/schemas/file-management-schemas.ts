import { z } from 'zod';

export const uploadSettingsSchema = z.object({
  maxUploadSizeMB: z.number().min(1, 'Min 1 MB').max(2048, 'Max 2048 MB'),
  allowedExtensions: z.string().min(1, 'At least one extension required'),
  storageProvider: z.enum(['Local', 'AWS S3', 'Azure Blob', 'Google Cloud', 'Cloudinary']),
  retentionDays: z.number().min(0),
  notifyOnUpload: z.boolean(),
});

export type UploadSettingsForm = z.infer<typeof uploadSettingsSchema>;

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100, 'Folder name is too long'),
  module: z.enum(['Candidates', 'Employees', 'Certificates', 'Results', 'Reports', 'Exams', 'General']),
  parentId: z.string().optional(),
});

export type CreateFolderForm = z.infer<typeof createFolderSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  module: z.enum(['Candidates', 'Employees', 'Certificates', 'Results', 'Reports', 'Exams', 'General']),
  allowedTypes: z.array(z.string()).min(1, 'Select at least one file type'),
  retentionDays: z.number().min(0).optional(),
});

export type CreateCategoryForm = z.infer<typeof createCategorySchema>;

export const fileFilterSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  module: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
});

export type FileFilterForm = z.infer<typeof fileFilterSchema>;
