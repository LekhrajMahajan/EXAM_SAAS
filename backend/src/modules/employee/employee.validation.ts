import { z } from "zod";

import { UserRole } from "../../constants/roles";
import { EmployeeStatus, Gender } from "./employee.types";

/*
|--------------------------------------------------------------------------
| Create Employee
|--------------------------------------------------------------------------
*/

const employeeBodySchema = z.object({
  companyId: z.string().trim().length(24, "Invalid Company Id").optional(),

  employeeCode: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .transform((value) => value.toUpperCase()),

  firstName: z.string().trim().min(2).max(50),

  middleName: z.string().trim().max(50).optional().nullable(),

  lastName: z.string().trim().min(2).max(50),

  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),

  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform((value) => value.toLowerCase())
    .optional()
    .nullable(),

  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  alternateMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid alternate phone number")
    .optional()
    .nullable()
    .or(z.literal('')),

  password: z.string().min(8).max(50).optional(),

  role: z.string().trim().optional(),

  roleId: z.string().length(24).optional(),

  branchId: z.string().length(24).optional(),

  department: z.string().trim().min(2).max(100),

  designation: z.string().trim().min(2).max(100),

  joiningDate: z.coerce.date(),

  dob: z.coerce.date().optional(),

  gender: z.nativeEnum(Gender).optional(),

  salary: z.number().min(0).optional(),

  reportingManager: z.string().trim().length(24).optional(),

  profileImage: z.string().url().optional(),

  address: z.string().max(500).optional(),

  city: z.string().max(100).optional(),

  state: z.string().max(100).optional(),

  country: z.string().max(100).optional(),

  pincode: z.string().max(10).optional(),

  status: z.nativeEnum(EmployeeStatus).optional(),
});

const employeePreprocess = (val: any) => {
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

export const createEmployeeSchema = z.object({
  body: z.preprocess(employeePreprocess, employeeBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
*/

export const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, "Invalid Employee Id"),
  }),
  body: z.preprocess(employeePreprocess, employeeBodySchema.partial())
});

/*
|--------------------------------------------------------------------------
| Employee Params
|--------------------------------------------------------------------------
*/

export const employeeIdSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, "Invalid Employee Id"),
  })
});

/*
|--------------------------------------------------------------------------
| Update Employee Status
|--------------------------------------------------------------------------
*/

export const updateEmployeeStatusSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, "Invalid Employee Id"),
  }),
  body: z.object({
    status: z.nativeEnum(EmployeeStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Assign Employee Role
|--------------------------------------------------------------------------
*/

export const assignEmployeeRoleSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, "Invalid Employee Id"),
  }),
  body: z.object({
    roleId: z.string().length(24, "Invalid Role Id"),
  })
});

/*
|--------------------------------------------------------------------------
| Employee Search
|--------------------------------------------------------------------------
*/

export const employeeSearchSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    companyId: z.string().length(24).optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
    verificationStatus: z.string().optional(),
    branchId: z.string().optional(),
    centerId: z.string().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Phase 5.4 Enterprise Employee Workflow Validation Schemas
|--------------------------------------------------------------------------
*/

export const inviteEmployeeSchema = z.object({
  body: z.object({
    companyId: z.string().trim().length(24, "Invalid Company Id"),
    email: z.string().email(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
    role: z.string().min(2),
    department: z.string().min(2),
    designation: z.string().min(2),
    branchId: z.string().length(24).optional().nullable(),
    centerId: z.string().length(24).optional().nullable(),
    joiningDate: z.string().optional(),
  })
});

export const completeProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    phone: z.string().optional(),
    alternateMobile: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
    profileImage: z.string().optional(),
    digitalSignature: z.string().optional(),
    bankDetails: z.any().optional(),
    emergencyContact: z.any().optional(),
    education: z.array(z.any()).optional(),
    experience: z.array(z.any()).optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
  })
});

export const uploadDocumentsSchema = z.object({
  body: z.object({
    documents: z.array(
      z.object({
        documentType: z.string().min(2),
        documentUrl: z.string().min(2),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
        expiryDate: z.string().optional().nullable(),
      })
    ).min(1, "At least one document is required")
  })
});

export const faceEnrollmentSchema = z.object({
  body: z.object({
    faceImageBase64: z.string().optional(),
    faceUrl: z.string().optional(),
    deviceId: z.string().optional(),
  })
});

export const approveVerificationSchema = z.object({
  body: z.object({
    employeeIds: z.union([z.string().length(24), z.array(z.string().length(24))]),
  })
});

export const rejectVerificationSchema = z.object({
  body: z.object({
    employeeId: z.string().length(24, "Invalid Employee Id"),
    reason: z.string().min(3, "Rejection reason is required"),
    correctionNotes: z.string().optional(),
  })
});

export const transferEmployeeSchema = z.object({
  body: z.object({
    branchId: z.string().length(24).optional().nullable(),
    centerId: z.string().length(24).optional().nullable(),
    reason: z.string().optional(),
  })
});

export const changeRoleSchema = z.object({
  body: z.object({
    role: z.string().min(2),
  })
});

export const bulkOperationSchema = z.object({
  body: z.object({
    action: z.enum(["VERIFY", "SUSPEND", "ACTIVATE", "ARCHIVE", "RESTORE", "RESET_PASSWORD"]),
    employeeIds: z.array(z.string().length(24)).min(1, "At least one employee ID must be provided"),
  })
});

