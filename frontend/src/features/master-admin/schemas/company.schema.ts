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
  companyType: z.string().trim().max(50, "Company type must be at most 50 characters").optional(),
  customCompanyType: z.string().trim().max(50, "Custom company type must be at most 50 characters").optional(),
  legalName: z.string().trim().max(150, "Legal name must be at most 150 characters").optional(),
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

  registrationDocument: z.string().optional(),
  mouDocument: z.string().optional(),
  panCardDocument: z.string().optional(),
  gstDocument: z.string().optional(),
  aadharCardDocument: z.string().optional(),
  msmeCertificateDocument: z.string().optional(),
  address: z.string().max(500, "Address must be at most 500 characters").optional(),
  city: z.string().max(50, "City must be at most 50 characters").optional(),
  state: z.string().max(50, "State must be at most 50 characters").optional(),
  country: z.string().max(50, "Country must be at most 50 characters").optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits").optional().or(z.literal("")),
  gstNumber: z.string().optional().refine(val => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(val), "Invalid GST Number format"),
  panNumber: z.string().optional().refine(val => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), "Invalid PAN format"),
  registrationNumber: z.string().optional().refine(val => !val || /^[a-zA-Z0-9]+$/.test(val), "Must contain only letters and numbers").refine(val => !val || val.length <= 21, "Must be at most 21 characters"),
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
