import { z } from "zod";

export const companySchema = z.object({
  companyCode: z
    .string()
    .trim()
    .min(2, "Company code must be at least 2 characters")
    .max(20, "Company code must be at most 20 characters")
    .transform((value) => value.toUpperCase()),
  companyName: z
    .string()
    .trim()
    .min(3, "Company name must be at least 3 characters")
    .max(100, "Company name must be at most 100 characters"),
  ownerName: z
    .string()
    .trim()
    .min(3, "Owner name must be at least 3 characters")
    .max(100, "Owner name must be at most 100 characters"),
  companyType: z.string().trim().min(1, "Company type is required").max(50, "Company type must be at most 50 characters"),
  customCompanyType: z.string().trim().max(50, "Custom company type must be at most 50 characters").optional(),
  legalName: z.string().trim().min(1, "Legal name is required").max(150, "Legal name must be at most 150 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number, must be 10 digits starting with 6-9"),
  alternatePhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid alternate phone number")
    .optional()
    .or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  registrationDocument: z.string().min(1, "Registration document is required"),
  mouDocument: z.string().min(1, "MOU document is required"),
  panCardDocument: z.string().min(1, "PAN card document is required"),
  gstDocument: z.string().min(1, "GST document is required"),
  aadharCardDocument: z.string().min(1, "Aadhar card document is required"),
  msmeCertificateDocument: z.string().min(1, "MSME certificate document is required"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address must be at most 500 characters"),
  city: z.string().trim().min(1, "City is required").max(50, "City must be at most 50 characters"),
  state: z.string().trim().min(1, "State is required").max(50, "State must be at most 50 characters"),
  country: z.string().trim().min(1, "Country is required").max(50, "Country must be at most 50 characters"),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
  gstNumber: z.string().min(1, "GST Number is required").regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Invalid GST Number format"),
  panNumber: z.string().min(1, "PAN Number is required").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  registrationNumber: z.string().min(1, "Registration Number is required").regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers").max(21, "Must be at most 21 characters"),
  subscriptionPlan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]).optional(),
  subscriptionStartDate: z.string().datetime().optional(),
  subscriptionEndDate: z.string().datetime().optional(),
  maxCenters: z.coerce.number().int().positive().optional(),
  maxEmployees: z.coerce.number().int().positive().optional(),
  maxCandidates: z.coerce.number().int().positive().optional(),
  status: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.companyType === "Other" && !data.customCompanyType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customCompanyType"],
      message: "Please specify the company type",
    });
  }
});

export type CompanyFormValues = z.input<typeof companySchema>;

export const companySearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  status: z.coerce.boolean().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  subscriptionPlan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]).optional(),
  approvalStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
});

export type CompanySearchParams = z.infer<typeof companySearchSchema>;
