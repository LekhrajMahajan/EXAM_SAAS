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
