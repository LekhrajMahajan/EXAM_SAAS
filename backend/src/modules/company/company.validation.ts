import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Create Company
|--------------------------------------------------------------------------
*/

const companyBodySchema = z.object({
  companyCode: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  companyName: z.string().trim().min(3).max(100),

  legalName: z.string().trim().max(150).optional(),

  companyType: z.string().trim().max(50).optional(),

  ownerName: z.string().trim().min(3).max(100),

  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),

  phone: z.string().regex(/^[6-9]\d{9}$/),

  alternatePhone: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),

  website: z.string().url().optional().or(z.literal("")),



  registrationDocument: z.string().optional(),

  mouDocument: z.string().optional(),

  panCardDocument: z.string().optional(),

  gstDocument: z.string().optional(),

  address: z.string().max(500).optional(),

  city: z.string().max(50).optional(),

  state: z.string().max(50).optional(),

  country: z.string().max(50).optional(),

  pincode: z.string().max(10).optional(),

  gstNumber: z.string().max(20).optional(),

  panNumber: z.string().max(20).optional(),

  registrationNumber: z.string().max(30).optional(),

  subscriptionPlan: z
    .enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"])
    .optional(),

  subscriptionStartDate: z.string().datetime().optional(),

  subscriptionEndDate: z.string().datetime().optional(),

  maxBranches: z.number().int().positive().optional(),

  maxCenters: z.number().int().positive().optional(),

  maxEmployees: z.number().int().positive().optional(),

  maxCandidates: z.number().int().positive().optional(),
});

const addressPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    if (data.address && typeof data.address === "object") {
      data.city = data.address.city || data.city;
      data.state = data.address.state || data.state;
      data.country = data.address.country || data.country;
      data.pincode = data.address.pincode || data.pincode;
      
      const line1 = data.address.addressLine1 || data.address.line1 || "";
      const line2 = data.address.addressLine2 || data.address.line2 || "";
      data.address = [line1, line2].filter(Boolean).join(", ") || String(data.address);
    }
    return data;
  }
  return val;
};

export const createCompanySchema = z.object({
  body: z.preprocess(addressPreprocess, companyBodySchema)
});

export const registerCompanySchema = z.object({
  body: z.preprocess(addressPreprocess, companyBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Company
|--------------------------------------------------------------------------
*/

export const updateCompanySchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
  body: z.preprocess(addressPreprocess, companyBodySchema.partial())
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateCompanyStatusSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
  body: z.object({
    status: z.boolean(),
  })
});

/*
|--------------------------------------------------------------------------
| Company Params
|--------------------------------------------------------------------------
*/

export const companyIdSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  })
});

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

export const companySearchSchema = z.object({
  query: z.object({
    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(10),

    search: z.string().optional(),

    status: z.coerce.boolean().optional(),

    city: z.string().optional(),

    state: z.string().optional(),

    subscriptionPlan: z
      .enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"])
      .optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Update Subscription
|--------------------------------------------------------------------------
*/

export const updateSubscriptionSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
  body: z.object({
    subscriptionPlan: z
      .enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"])
      .optional(),
    subscriptionStartDate: z.string().datetime().optional(),
    subscriptionEndDate: z.string().datetime().optional(),
  }),
});
