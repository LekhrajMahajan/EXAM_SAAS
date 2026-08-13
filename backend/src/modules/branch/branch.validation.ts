import { z } from "zod";
import { BranchStatus } from "./branch.types";

/*
|--------------------------------------------------------------------------
| Mongo ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Branch
|--------------------------------------------------------------------------
*/

const branchBodySchema = z.object({
  companyId: objectId.optional(),

  branchCode: z
    .string()
    .trim()
    .min(2, "Branch code is required")
    .max(20)
    .transform((value) => value.toUpperCase()),

  branchName: z.string().trim().min(3, "Branch name is required").max(150),

  branchType: z.string().trim().max(50).optional(),
  examCenterCode: z.string().trim().max(50).optional(),
  totalLabs: z.coerce.number().min(0).optional(),
  totalSystems: z.coerce.number().min(0).optional(),
  facilities: z.array(z.string()).optional(),

  parentBranchId: objectId.optional().nullable(),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  phone: z.string().trim().min(1, "Phone is required"),

  alternatePhone: z.string().trim().optional(),

  address: z.string().trim().min(1, "Address is required"),

  city: z.string().trim().min(1, "City is required"),

  state: z.string().trim().min(1, "State is required"),

  country: z.string().trim().min(1, "Country is required"),

  postalCode: z.string().trim().min(1, "Postal code is required"),

  managerName: z.string().trim().max(100).optional(),

  status: z.nativeEnum(BranchStatus).optional(),

  legalDocuments: z.array(z.record(z.string(), z.any())).optional(),
});

const addressPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    if (data.address && typeof data.address === "object") {
      data.city = data.address.city || data.city;
      data.state = data.address.state || data.state;
      data.country = data.address.country || data.country;
      data.postalCode = data.address.postalCode || data.address.pincode || data.postalCode;
      
      const line1 = data.address.addressLine1 || data.address.line1 || "";
      const line2 = data.address.addressLine2 || data.address.line2 || "";
      data.address = [line1, line2].filter(Boolean).join(", ") || String(data.address);
    }
    // Remove empty strings for optional/nullable fields to prevent Zod 400 Bad Request errors
    if (data.alternatePhone === "") delete data.alternatePhone;
    if (data.parentBranchId === "") delete data.parentBranchId;
    if (data.examCenterCode === "") delete data.examCenterCode;
    if (data.branchType === "") delete data.branchType;
    if (data.managerName === "") delete data.managerName;
    if (data.companyId === "") delete data.companyId;
    return data;
  }
  return val;
};

export const createBranchSchema = z.object({
  body: z.preprocess(addressPreprocess, branchBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Branch
|--------------------------------------------------------------------------
*/

export const updateBranchSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(addressPreprocess, branchBodySchema.partial())
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateBranchStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(BranchStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Bulk Operations Validation
|--------------------------------------------------------------------------
*/

export const bulkOperationSchema = z.object({
  body: z.object({
    ids: z.array(objectId).min(1, "At least one branch ID is required"),
    companyId: objectId.optional(),
  }),
});

export const bulkStatusSchema = z.object({
  body: z.object({
    ids: z.array(objectId).min(1, "At least one branch ID is required"),
    status: z.nativeEnum(BranchStatus),
    companyId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Import Validation Schema
|--------------------------------------------------------------------------
*/

export const importValidationSchema = z.object({
  body: z.object({
    companyId: objectId,
    rows: z.array(z.record(z.string(), z.any())).min(1, "At least one row is required for validation"),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const branchIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

export const branchAnalyticsSchema = z.object({
  params: z.object({
    branchId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const branchQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    companyId: objectId.optional(),

    branchType: z.string().trim().optional(),

    city: z.string().trim().optional(),

    state: z.string().trim().optional(),

    country: z.string().trim().optional(),

    status: z.string().trim().optional(),

    createdBy: objectId.optional(),

    createdDate: z.string().optional(),

    updatedDate: z.string().optional(),

    sort: z.string().optional(),

    order: z.enum(["asc", "desc"]).optional(),

    format: z.string().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| PHASE 5.2: BRANCH ONBOARDING WORKFLOW SCHEMAS
|--------------------------------------------------------------------------
*/

export const onboardingBranchParamSchema = z.object({
  params: z.object({
    branchId: objectId.optional(),
  }).optional(),
});

export const reviewOnboardingSchema = z.object({
  params: z.object({
    branchId: objectId,
  }),
  body: z.object({
    action: z.enum(["APPROVE", "REJECT"] as const, { message: "Action must be APPROVE or REJECT" }),
    remarks: z.string().trim().min(2, "Review remarks are required").max(500),
  }),
});

export const stepProfileSchema = z.object({
  params: z.object({
    branchId: objectId.optional(),
  }).optional(),
  body: z.record(z.string(), z.any()),
});

export const stepDocumentsSchema = z.object({
  params: z.object({
    branchId: objectId.optional(),
  }).optional(),
  body: z.union([
    z.array(z.record(z.string(), z.any())),
    z.object({
      documents: z.array(z.record(z.string(), z.any())),
    }),
  ]),
});

export const stepStaffSchema = z.object({
  params: z.object({
    branchId: objectId.optional(),
  }).optional(),
  body: z.union([
    z.array(z.record(z.string(), z.any())),
    z.object({
      staff: z.array(z.record(z.string(), z.any())),
    }),
  ]),
});
