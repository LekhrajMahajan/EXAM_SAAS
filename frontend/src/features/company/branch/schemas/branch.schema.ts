import { z } from "zod";

export const branchSchema = z.object({
  companyId: z.string().trim().optional(),
  branchType: z.string().default("Branch"),
  branchCode: z.string().trim().min(2, "Branch code is required").max(20),
  branchName: z.string().trim().min(3, "Branch name is required").max(150),
  examCenterCode: z.string().trim().max(50).optional(),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(10, "Phone is required").max(15),
  alternatePhone: z.string().trim().max(15).optional(),
  address: z.string().trim().min(5, "Address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  country: z.string().trim().min(2, "Country is required").max(100).default("India"),
  postalCode: z.string().trim().min(4, "Postal code is required").max(10),
  managerName: z.string().trim().min(2, "Contact person name is required").max(100),
  totalLabs: z.coerce.number().min(0).default(0),
  totalSystems: z.coerce.number().min(0).default(0),
  facilities: z.array(z.string()).default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type BranchFormData = z.infer<typeof branchSchema>;
