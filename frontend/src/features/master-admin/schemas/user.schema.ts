import { z } from "zod";

export const baseUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  middleName: z.string().max(50).optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dob: z.string().optional(),
  profileImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit mobile number").min(1, "Mobile is required"),
  alternateMobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit alternate mobile").optional().or(z.literal("")),
  address: z.string().max(500, "Address is too long").optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),

  employeeCode: z.string().min(3, "Employee ID must be at least 3 characters").max(20),
  companyId: z.string().min(1, "Company is required"),
  branchId: z.string().min(1, "Branch is required"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  joiningDate: z.string().min(1, "Joining date is required"),

  role: z.string().min(1, "Role is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED"]),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).optional().or(z.literal("")),
});

export const createUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editUserSchema = baseUserSchema;

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;
