import { z } from "zod";

import { Gender, UserLanguage, UserTheme } from "./user.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2).max(100),

    lastName: z.string().trim().min(2).max(100),

    employeeId: z.string().trim().optional().nullable(),

    department: z.string().trim().optional().nullable(),

    designation: z.string().trim().optional().nullable(),

    gender: z.nativeEnum(Gender).optional(),

    profileImage: z.string().url().optional().nullable(),
  }),
});

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8),

    newPassword: z.string().min(8).max(100),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Profile Image
|--------------------------------------------------------------------------
*/

export const updateProfileImageSchema = z.object({
  body: z.object({
    profileImage: z.string().url(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Preferences
|--------------------------------------------------------------------------
*/

export const updatePreferenceSchema = z.object({
  body: z.object({
    theme: z.nativeEnum(UserTheme).optional(),

    language: z.nativeEnum(UserLanguage).optional(),

    notifications: z
      .object({
        email: z.boolean().optional(),

        sms: z.boolean().optional(),

        push: z.boolean().optional(),
      })
      .optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Device Id
|--------------------------------------------------------------------------
*/

export const deviceIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Session Id
|--------------------------------------------------------------------------
*/

export const sessionIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});
