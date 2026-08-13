import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import systemSettingsService from "./systemSettings.service";

import { SettingCategory, SettingType } from "./systemSettings.types";
import { encrypt } from "../../utils/encrypt";
import fileStorageService from "../file-storage/fileStorage.service";
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
| Get Setting By Key
|--------------------------------------------------------------------------
*/

export const getSystemInfo = asyncHandler(
  async (_req: Request, res: Response) => {
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "System info fetched successfully.",
      data: {
        currentVersion: "v1.0.0",
        backendVersion: process.env.npm_package_version || "1.0.0",
        frontendVersion: "1.0.0",
        databaseVersion: "MongoDB", // Assuming MongoDB is used since we are in a Mongoose env
        buildDate: new Date().toISOString(),
        serverTime: new Date().toISOString(),
      },
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

export const uploadOrganizationLogo = asyncHandler(
  async (req: Request, res: Response) => {
    const key = req.params.key as string;
    const file = req.file;

    if (!file) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {
        success: false,
        message: "No file uploaded.",
        data: null,
      });
    }

    let fileUrl: string;
    try {
      const uploadedFile = await fileStorageService.upload({
        fileName: `organization_logo_${Date.now()}_${file.originalname}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileType: FileType.IMAGE,
        uploadedBy: new mongoose.Types.ObjectId(req.user!.userId) as any,
      }, file);
      
      fileUrl = (uploadedFile as any).url;
    } catch (error) {
      return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        message: "Failed to upload logo to storage.",
        data: null,
      });
    }

    const category = SettingCategory.ORGANIZATION;

    try {
      await systemSettingsService.updateByKey(
        key,
        { value: fileUrl },
        req.user!.userId as string
      );
    } catch (error: any) {
      if (error.statusCode === httpStatus.NOT_FOUND) {
        await systemSettingsService.create(
          {
            key,
            value: fileUrl,
            category,
            type: SettingType.STRING,
          },
          req.user!.userId as string
        );
      } else {
        throw error;
      }
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Logo uploaded successfully.",
      data: { url: fileUrl },
    });
  }
);

export const deleteOrganizationLogo = asyncHandler(
  async (req: Request, res: Response) => {
    const key = req.params.key as string;
    const category = SettingCategory.ORGANIZATION;

    try {
      await systemSettingsService.updateByKey(
        key,
        { value: "" },
        req.user!.userId as string
      );
    } catch (error: any) {
      if (error.statusCode === httpStatus.NOT_FOUND) {
        await systemSettingsService.create(
          {
            key,
            value: "",
            category,
            type: SettingType.STRING,
          },
          req.user!.userId as string
        );
      } else {
        throw error;
      }
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Logo deleted successfully.",
      data: null,
    });
  }
);

export const testEmailGateway = asyncHandler(
  async (req: Request, res: Response) => {
    const { to } = req.body;
    if (!to) {
      return sendResponse(res, httpStatus.BAD_REQUEST, { success: false, message: "Recipient email is required.", data: null });
    }

    const emailService = require('../email/email.service').default;
    try {
      await emailService.send({
        to,
        subject: "Test Email Configuration",
        text: "This is a test email to confirm your SMTP configuration is working correctly.",
      });

      sendResponse(res, httpStatus.OK, {
        success: true,
        message: "Test email sent successfully.",
        data: null,
      });
    } catch (error: any) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        message: "Test email failed: " + error.message,
        data: null,
      });
    }
  }
);

export const testSmsGateway = asyncHandler(
  async (req: Request, res: Response) => {
    const { phone } = req.body;
    if (!phone) {
      return sendResponse(res, httpStatus.BAD_REQUEST, { success: false, message: "Recipient phone is required.", data: null });
    }

    const smsService = require('../sms/sms.service').default;
    try {
      await smsService.send({
        phone,
        message: "This is a test SMS to confirm your configuration is working correctly.",
      });

      sendResponse(res, httpStatus.OK, {
        success: true,
        message: "Test SMS sent successfully.",
        data: null,
      });
    } catch (error: any) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        message: "Test SMS failed: " + error.message,
        data: null,
      });
    }
  }
);

export const testStorageGateway = asyncHandler(
  async (req: Request, res: Response) => {
    // For test, we will create a dummy text file buffer
    const fileStorageService = require('../file-storage/fileStorage.service').default;
    
    try {
      const dummyFile = Buffer.from("ExamGuard Test File");
      const result = await fileStorageService.upload({
        fileName: "test-storage.txt",
        originalName: "test-storage.txt",
        mimeType: "text/plain",
        fileType: "DOCUMENT",
        size: dummyFile.length,
        isPublic: false,
        uploadedBy: req.user!.userId as any,
      }, dummyFile);

      sendResponse(res, httpStatus.OK, {
        success: true,
        message: "Test file uploaded successfully to " + result.storageProvider,
        data: result,
      });
    } catch (error: any) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        message: "Test storage upload failed: " + error.message,
        data: null,
      });
    }
  }
);

export const switchStorageProvider = asyncHandler(
  async (req: Request, res: Response) => {
    const { provider } = req.body;
    if (!provider) {
      return sendResponse(res, httpStatus.BAD_REQUEST, { success: false, message: "Provider is required.", data: null });
    }

    const userId = req.user!.userId as string;
    const systemSettingsService = require('./systemSettings.service').default;
    const { SettingCategory, SettingType } = require('./systemSettings.types');

    try {
      await systemSettingsService.updateByKey('STORAGE_PROVIDER', { value: provider }, userId);
    } catch (error: any) {
      if (error.statusCode === httpStatus.NOT_FOUND) {
        await systemSettingsService.create({
          key: 'STORAGE_PROVIDER',
          value: provider,
          category: SettingCategory.STORAGE,
          type: SettingType.STRING
        }, userId);
      } else {
        throw error;
      }
    }

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Storage provider switched to " + provider,
      data: null,
    });
  }
);

export const triggerBackup = asyncHandler(
  async (req: Request, res: Response) => {
    const queueService = require('../queue/queue.service').default;
    const { QueueType } = require('../queue/queue.types');
    
    // Push a backup job
    await queueService.addJob({
        queue: QueueType.BACKUP,
        name: "CreateDatabaseBackup",
        data: { action: "CREATE_DATABASE_BACKUP", triggeredBy: req.user!.userId }
    });

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Backup job triggered and added to queue.",
      data: null,
    });
  }
);

export const restoreBackup = asyncHandler(
  async (req: Request, res: Response) => {
    const { backupId, password } = req.body;
    
    // Verify admin password
    const User = require('../auth/user.model').default;
    const bcrypt = require('bcryptjs');
    const admin = await User.findById(req.user!.userId).select("+password");
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
       return sendResponse(res, httpStatus.UNAUTHORIZED, { success: false, message: "Invalid password for restore operation.", data: null });
    }

    const queueService = require('../queue/queue.service').default;
    const { QueueType } = require('../queue/queue.types');

    await queueService.addJob({
        queue: QueueType.BACKUP,
        name: "RestoreDatabaseBackup",
        data: { action: "RESTORE_DATABASE_BACKUP", backupId, triggeredBy: req.user!.userId }
    });

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Restore job triggered and added to queue.",
      data: null,
    });
  }
);

export const getBackupHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { BackupHistory } = require('../backup/backupHistory.model');
    const history = await BackupHistory.find().sort({ createdAt: -1 }).populate('triggeredBy', 'firstName lastName email').lean();

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Backup history fetched successfully.",
      data: history,
    });
  }
);
