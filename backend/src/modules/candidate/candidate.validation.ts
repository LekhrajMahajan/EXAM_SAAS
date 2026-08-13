import { z } from "zod";
import { CandidateStatus, Gender, Category } from "./candidate.types";

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
| Regex
|--------------------------------------------------------------------------
*/

const mobileRegex = /^[6-9]\d{9}$/;

const aadharRegex = /^\d{12}$/;

const postalCodeRegex = /^\d{6}$/;

/*
|--------------------------------------------------------------------------
| Create Candidate
|--------------------------------------------------------------------------
*/

const candidateBodySchema = z.object({
  companyId: objectId,

  branchId: objectId,

  centerId: objectId,

  candidateCode: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .transform((v) => v.toUpperCase()),

  applicationNo: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .transform((v) => v.toUpperCase()),

  enrollmentNo: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .transform((v) => v.toUpperCase()),

  firstName: z.string().trim().min(2).max(100),

  middleName: z.string().trim().max(100).optional(),

  lastName: z.string().trim().min(1).max(100),

  fullName: z.string().trim().min(2).max(250),

  email: z.string().trim().email(),

  mobile: z.string().regex(mobileRegex, "Invalid mobile number"),

  alternateMobile: z
    .string()
    .regex(mobileRegex, "Invalid alternate mobile")
    .optional(),

  gender: z.nativeEnum(Gender),

  dob: z.coerce.date(),

  category: z.nativeEnum(Category),

  bloodGroup: z.string().trim().optional(),

  photo: z.string().trim().optional(),

  signature: z.string().trim().optional(),

  aadharNumber: z
    .string()
    .regex(aadharRegex, "Invalid Aadhaar Number")
    .optional(),

  governmentId: z.string().trim().optional(),

  address: z.string().trim().min(5).max(500),

  city: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  country: z.string().trim().default("India"),

  postalCode: z.string().regex(postalCodeRegex, "Invalid postal code"),

  qualification: z.string().trim(),

  college: z.string().trim(),

  course: z.string().trim(),

  year: z.number().int().min(1).max(10),
});

const candidatePreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    
    if (data.phone && !data.mobile) data.mobile = data.phone;
    
    if (data.address && typeof data.address === "object") {
      data.postalCode = data.address.pincode || data.postalCode;
      
      const line1 = data.address.addressLine1 || data.address.line1 || "";
      const line2 = data.address.addressLine2 || data.address.line2 || "";
      data.city = data.address.city || data.city;
      data.state = data.address.state || data.state;
      data.country = data.address.country || data.country;
      
      data.address = [line1, line2].filter(Boolean).join(", ") || String(data.address);
    }

    if (!data.fullName && data.firstName && data.lastName) {
      data.fullName = `${data.firstName} ${data.lastName}`;
    }

    if (!data.applicationNo && data.candidateCode) data.applicationNo = `APP-${data.candidateCode}`;
    if (!data.enrollmentNo && data.candidateCode) data.enrollmentNo = `ENR-${data.candidateCode}`;
    if (!data.college) data.college = "N/A";
    if (!data.course) data.course = "N/A";
    if (!data.year) data.year = 1;

    return data;
  }
  return val;
};

export const createCandidateSchema = z.object({
  body: z.preprocess(candidatePreprocess, candidateBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Candidate
|--------------------------------------------------------------------------
*/

export const updateCandidateSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(candidatePreprocess, candidateBodySchema.partial())
});

/*
|--------------------------------------------------------------------------
| Assign Seat
|--------------------------------------------------------------------------
*/

export const assignSeatSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    seatId: objectId,
    examId: objectId.optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateCandidateStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(CandidateStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Verification
|--------------------------------------------------------------------------
*/

export const verificationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    biometricVerified: z.boolean().optional(),
    faceVerified: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    mobileVerified: z.boolean().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Hall Ticket
|--------------------------------------------------------------------------
*/

export const hallTicketSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    hallTicketGenerated: z.boolean(),
  })
});

/*
|--------------------------------------------------------------------------
| Bulk Import
|--------------------------------------------------------------------------
*/

export const importCandidateSchema = z.object({
  body: z.object({
    companyId: objectId,
    branchId: objectId,
    centerId: objectId,
  })
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const candidateIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const candidateQuerySchema = z.object({
  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(10),

  search: z.string().optional(),

  companyId: objectId.optional(),

  branchId: objectId.optional(),

  centerId: objectId.optional(),

  examId: objectId.optional(),

  seatId: objectId.optional(),

  gender: z.nativeEnum(Gender).optional(),

  category: z.nativeEnum(Category).optional(),

  status: z.nativeEnum(CandidateStatus).optional(),

  biometricVerified: z.coerce.boolean().optional(),

  faceVerified: z.coerce.boolean().optional(),

  hallTicketGenerated: z.coerce.boolean().optional(),
});
