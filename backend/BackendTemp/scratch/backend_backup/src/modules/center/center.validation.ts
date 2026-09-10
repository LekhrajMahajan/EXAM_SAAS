import { z } from "zod";
import { CenterStatus, CenterType } from "./center.types";

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
| Create Center
|--------------------------------------------------------------------------
*/

const centerBaseObjectSchema = z
  .object({
    companyId: objectId.optional(),

    centerCode: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((value) => value.toUpperCase()),

    centerName: z.string().trim().min(3).max(150),

    centerType: z.nativeEnum(CenterType),

    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase()),

    phone: z.string().trim().min(10).max(15),

    alternatePhone: z.string().trim().min(10).max(15).optional(),

    address: z.string().trim().min(5).max(300),

    city: z.string().trim().min(2).max(100),

    state: z.string().trim().min(2).max(100),

    country: z.string().trim().min(2).max(100),

    postalCode: z.string().trim().min(4).max(10),

    latitude: z.number().min(-90).max(90).optional(),

    longitude: z.number().min(-180).max(180).optional(),

    capacity: z.number().int().positive(),

    availableCapacity: z.number().int().nonnegative().optional(),

    managerName: z.string().trim().max(100).optional(),

    examCategories: z.array(z.string()).optional(),

    mouPdfUrl: z.string().optional(),

    commercialAgreement: z.array(z.any()).optional(),

    totalLabs: z.number().optional(),
    totalSystems: z.number().optional(),
    shifts: z.array(z.any()).optional(),
    facilities: z.array(z.any()).optional(),

    status: z.nativeEnum(CenterStatus).optional(),
  }).passthrough();

const centerBodySchema = centerBaseObjectSchema.refine((data) => (data.availableCapacity ?? data.capacity) <= data.capacity, {
    message: "Available capacity cannot exceed total capacity.",
    path: ["availableCapacity"],
  });

const centerPreprocess = (val: any) => {
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

    if (data.centerHead && typeof data.centerHead === "object") {
      data.managerName = data.centerHead.name || data.managerName;
    }

    if (data.availableCapacity === undefined && data.capacity !== undefined) {
       data.availableCapacity = data.capacity;
    }


    if (!data.postalCode && data.pincode) data.postalCode = data.pincode;
    if (!data.email && data.headEmail) data.email = data.headEmail;
    if (!data.phone && data.headMobile) data.phone = data.headMobile;
    if (!data.managerName && data.headName) data.managerName = data.headName;
    if (!data.country) data.country = "India";
    if (!data.centerType) data.centerType = "PRIVATE";
    if (!data.capacity && data.maxCandidates) data.capacity = Number(data.maxCandidates) || 100;
    if (data.capacity && typeof data.capacity === "string") data.capacity = Number(data.capacity);
    if (data.availableCapacity && typeof data.availableCapacity === "string") data.availableCapacity = Number(data.availableCapacity);

    return data;
  }
  return val;
};

export const createCenterSchema = z.object({
  body: z.preprocess(centerPreprocess, centerBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Center
|--------------------------------------------------------------------------
*/

export const updateCenterSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(
    centerPreprocess, 
    centerBaseObjectSchema.partial()
  )
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateCenterStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(CenterStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const centerIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const centerQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    companyId: objectId.optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    centerType: z.nativeEnum(CenterType).optional(),
    status: z.nativeEnum(CenterStatus).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Phase 5.3 Onboarding & Verification Schemas
|--------------------------------------------------------------------------
*/

export const saveOnboardingStepSchema = z.object({
  body: z.any(),
});

export const verifyDocumentSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1),
  }),
  body: z.object({
    rejectionReason: z.string().optional(),
    correctionNotes: z.string().optional(),
  }),
});

export const verifyCenterSetupSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "REJECTED"]),
    remarks: z.string().optional(),
  }),
});

