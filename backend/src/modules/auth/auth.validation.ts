import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50),

    email: z.string().trim().email("Invalid email address").toLowerCase(),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain one uppercase letter")
      .regex(/[a-z]/, "Must contain one lowercase letter")
      .regex(/[0-9]/, "Must contain one number")
      .regex(/[^A-Za-z0-9]/, "Must contain one special character"),

    companyId: z.string().optional(),

    role: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address").toLowerCase(),

    password: z.string().min(1, "Password is required"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address").toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address").toLowerCase(),
    otp: z.string().min(1, "OTP is required"),
  }),
});
