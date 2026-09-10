import { z } from "zod";

import {
  SettingCategory,
  SettingType,
  SettingVisibility,
} from "./systemSettings.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Create Setting
|--------------------------------------------------------------------------
*/

export const createSettingSchema = z.object({
  body: z.object({
    category: z.nativeEnum(SettingCategory),

    key: z.string().min(2).max(100).trim(),

    value: z.any(),

    type: z.nativeEnum(SettingType),

    visibility: z.nativeEnum(SettingVisibility).optional(),

    description: z.string().max(500).optional(),

    isEditable: z.boolean().optional(),

    isActive: z.boolean().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Setting
|--------------------------------------------------------------------------
*/

export const updateSettingSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    category: z.nativeEnum(SettingCategory).optional(),

    key: z.string().min(2).max(100).trim().optional(),

    value: z.any().optional(),

    type: z.nativeEnum(SettingType).optional(),

    visibility: z.nativeEnum(SettingVisibility).optional(),

    description: z.string().max(500).optional(),

    isEditable: z.boolean().optional(),

    isActive: z.boolean().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Setting Id
|--------------------------------------------------------------------------
*/

export const settingIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Setting Key
|--------------------------------------------------------------------------
*/

export const settingKeySchema = z.object({
  params: z.object({
    key: z.string().min(2).max(100),
  }),
});

/*
|--------------------------------------------------------------------------
| Reset Settings
|--------------------------------------------------------------------------
*/

export const resetSettingsSchema = z.object({
  body: z.object({
    category: z.nativeEnum(SettingCategory).optional(),

    resetAll: z.boolean().default(false),
  }),
});

/*
|--------------------------------------------------------------------------
| Bulk Update General Settings
|--------------------------------------------------------------------------
*/

export const bulkUpdateGeneralSettingsSchema = z.object({
  body: z.object({
    ORG_GST_NUMBER: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number").or(z.literal("")).optional(),
    ORG_PAN_NUMBER: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number").or(z.literal("")).optional(),
    ORG_POSTAL_CODE: z.string().regex(/^[a-zA-Z0-9\s\-]{3,10}$/, "Invalid postal code").or(z.literal("")).optional(),
    ORG_CONTACT_PHONE: z.string().regex(/^\+?[0-9\s\-\(\)]{7,15}$/, "Invalid phone number").or(z.literal("")).optional(),
    ORG_EMERGENCY_CONTACT: z.string().regex(/^\+?[0-9\s\-\(\)]{7,15}$/, "Invalid emergency contact number").or(z.literal("")).optional(),
    ORG_CONTACT_EMAIL: z.string().email("Invalid email format").or(z.literal("")).optional(),
    SOCIAL_FACEBOOK: z.string().url("Invalid URL").or(z.literal("")).optional(),
    SOCIAL_LINKEDIN: z.string().url("Invalid URL").or(z.literal("")).optional(),
    SOCIAL_TWITTER: z.string().url("Invalid URL").or(z.literal("")).optional(),
    SOCIAL_INSTAGRAM: z.string().url("Invalid URL").or(z.literal("")).optional(),
    SOCIAL_YOUTUBE: z.string().url("Invalid URL").or(z.literal("")).optional(),
  }).passthrough()
});
