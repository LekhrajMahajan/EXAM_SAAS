import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import systemSettingsService from "./systemSettings.service";

import { SettingCategory, SettingType } from "./systemSettings.types";
import { encrypt } from "../../utils/encrypt";
import { FileType } from "../file-storage/fileStorage.types";
import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Create Setting
|--------------------------------------------------------------------------
*/

export const createSetting = asyncHandler(
  async (req: Request, res: Response) => {
    const setting = await systemSettingsService.create(
      req.body,

      req.user!.userId as string,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "System setting created successfully.",

      data: setting,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Setting By Id
|--------------------------------------------------------------------------
*/

export const getSettingById = asyncHandler(
  async (req: Request, res: Response) => {
    const setting = await systemSettingsService.getById(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System setting fetched successfully.",

      data: setting,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Setting By Key
|--------------------------------------------------------------------------
*/

export const getSettingByKey = asyncHandler(
  async (req: Request, res: Response) => {
    const setting = await systemSettingsService.getByKey(
      req.params.key as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System setting fetched successfully.",

      data: setting,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Settings
|--------------------------------------------------------------------------
*/

export const getSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await systemSettingsService.getAll({});

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System settings fetched successfully.",

      data: settings,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Settings By Category
|--------------------------------------------------------------------------
*/

export const getSettingsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await systemSettingsService.getByCategory(
      req.params.category as SettingCategory,
    );

    // Mask sensitive credentials
    const maskedSettings = settings.map((s: any) => {
      const settingObj = s.toObject ? s.toObject() : { ...s };
      if (
        (settingObj.category === SettingCategory.SMTP || settingObj.category === SettingCategory.SMS) &&
        typeof settingObj.value === "string" &&
        (settingObj.key.endsWith("PASSWORD") || settingObj.key.endsWith("SECRET") || settingObj.key.endsWith("KEY") || settingObj.key.endsWith("VAPID_PRIVATE_KEY"))
      ) {
        settingObj.value = "********";
      }
      return settingObj;
    });

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Category settings fetched successfully.",

      data: maskedSettings,
    });
  },
);

/*
|--------------------------------------------------------------------------
*/

export const updateSetting = asyncHandler(
  async (req: Request, res: Response) => {
    const setting = await systemSettingsService.update(
      req.params.id as string,

      req.body,

      req.user!.userId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System setting updated successfully.",

      data: setting,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Setting
|--------------------------------------------------------------------------
*/

export const deleteSetting = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await systemSettingsService.delete(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System setting deleted successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Reset Category
|--------------------------------------------------------------------------
*/

export const resetCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await systemSettingsService.resetCategory(
      req.body.category as SettingCategory,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Settings reset successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Public Settings
|--------------------------------------------------------------------------
*/

export const getPublicSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await systemSettingsService.getPublicSettings();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Public settings fetched successfully.",

      data: settings,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Export Settings
|--------------------------------------------------------------------------
*/

export const exportSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await systemSettingsService.exportSettings();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Settings exported successfully.",

      data: settings,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Import Settings
|--------------------------------------------------------------------------
*/

export const importSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await systemSettingsService.importSettings(
      req.body,

      req.user!.userId as string,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Settings imported successfully.",

    });
  },
);



/*
|--------------------------------------------------------------------------
| Bulk Update General Settings
|--------------------------------------------------------------------------
*/

export const updateGeneralSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const settingsUpdates = req.body;

    if (typeof settingsUpdates === 'object' && settingsUpdates !== null) {
      for (const [key, value] of Object.entries(settingsUpdates)) {
        try {
          // Attempt to update
          await systemSettingsService.updateByKey(
            key,
            { value },
            req.user!.userId as string
          );
        } catch (error: any) {
           if (error.statusCode === httpStatus.NOT_FOUND) {
             let type = SettingType.STRING;
             if (typeof value === 'number') type = SettingType.NUMBER;
             else if (typeof value === 'boolean') type = SettingType.BOOLEAN;
             else if (typeof value === 'object') type = SettingType.OBJECT;

             try {
               await systemSettingsService.create(
                 {
                   key,
                   value,
                   category: SettingCategory.GENERAL,
                   type,
                 },
                 req.user!.userId as string
               );
             } catch (createError) {
               console.error(`Failed to create setting ${key}:`, createError);
             }
           } else {
             console.error(`Failed to update setting ${key}:`, error);
           }
        }
      }
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "General settings updated successfully.",
      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Update Category Settings
|--------------------------------------------------------------------------
*/

export const updateCategorySettings = asyncHandler(
  async (req: Request, res: Response) => {
    const settingsUpdates = req.body;
    const category = req.params.category as SettingCategory;

    if (typeof settingsUpdates === 'object' && settingsUpdates !== null) {
      for (let [key, value] of Object.entries(settingsUpdates)) {
        if (value === "********") continue;

        // Encrypt sensitive fields
        if (
          (category === SettingCategory.SMTP || category === SettingCategory.SMS || category === SettingCategory.NOTIFICATIONS || category === SettingCategory.STORAGE) &&
          typeof value === "string" &&
          (key.endsWith("PASSWORD") || key.endsWith("SECRET") || key.endsWith("KEY") || key.endsWith("VAPID_PRIVATE_KEY"))
        ) {
          value = encrypt(value);
        }

        try {
          // Attempt to update
          await systemSettingsService.updateByKey(
            key,
            { value },
            req.user!.userId as string
          );
        } catch (error: any) {
           if (error.statusCode === httpStatus.NOT_FOUND) {
             let type = SettingType.STRING;
             if (typeof value === 'number') type = SettingType.NUMBER;
             else if (typeof value === 'boolean') type = SettingType.BOOLEAN;
             else if (typeof value === 'object') type = SettingType.OBJECT;

             try {
               await systemSettingsService.create(
                 {
                   key,
                   value,
                   category,
                   type,
                 },
                 req.user!.userId as string
               );
             } catch (createError) {
               console.error(`Failed to create setting ${key}:`, createError);
             }
           } else {
             console.error(`Failed to update setting ${key}:`, error);
           }
        }
      }
    }

    if (
      category === SettingCategory.SECURITY || 
      category === SettingCategory.NOTIFICATIONS || 
      category === SettingCategory.SMTP || 
      category === SettingCategory.SMS
    ) {
       // Only import this when needed, or import at top level
       const settingsCache = require('./settingsCache.service').default;
       await settingsCache.refreshCache();
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: `${category} settings updated successfully.`,
      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Organization Settings
|--------------------------------------------------------------------------
*/

export const getOrganizationSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await systemSettingsService.getByCategory(
      SettingCategory.ORGANIZATION,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Organization settings retrieved successfully.",
      data: settings,
    });
  },
);

export const updateOrganizationSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const updates = req.body;
    const category = SettingCategory.ORGANIZATION;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        try {
          await systemSettingsService.updateByKey(
            key,
            { value },
            req.user!.userId as string
          );
        } catch (error: any) {
           if (error.statusCode === httpStatus.NOT_FOUND) {
             let type = SettingType.STRING;
             if (typeof value === 'number') type = SettingType.NUMBER;
             else if (typeof value === 'boolean') type = SettingType.BOOLEAN;
             else if (typeof value === 'object') type = SettingType.OBJECT;

             try {
               await systemSettingsService.create(
                 {
                   key,
                   value,
                   category,
                   type,
                 },
                 req.user!.userId as string
               );
             } catch (createError) {
               console.error(`Failed to create setting ${key}:`, createError);
             }
           } else {
             console.error(`Failed to update setting ${key}:`, error);
           }
        }
      }
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Organization settings updated successfully.",
      data: null,
    });
  }
);

