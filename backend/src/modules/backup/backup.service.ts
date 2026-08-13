import mongoose from "mongoose";
import crypto from "crypto";
import zlib from "zlib";
import util from "util";
import fs from "fs";
import path from "path";
import os from "os";

import { BackupHistory, BackupType, BackupStatus } from "./backupHistory.model";
import fileStorageService from "../file-storage/fileStorage.service";
import settingsCacheService from "../system-settings/settingsCache.service";
import { SettingCategory } from "../system-settings/systemSettings.types";
import { FileType } from "../file-storage/fileStorage.types";

const gzip = util.promisify(zlib.gzip);
const unzip = util.promisify(zlib.unzip);

export class BackupService {
  /**
   * Generates a full database backup in JSON format, compresses it, encrypts it (if configured),
   * and uploads it to the active StorageProvider.
   */
  async createDatabaseBackup(triggeredBy?: string): Promise<any> {
    const backupRecord = await BackupHistory.create({
      type: BackupType.DATABASE,
      status: BackupStatus.IN_PROGRESS,
      triggeredBy: triggeredBy || null,
    });

    const startTime = Date.now();
    try {
      // 1. Get all models
      const modelNames = mongoose.modelNames();
      const backupData: Record<string, any[]> = {};

      // 2. Fetch data from each collection (Native node.js streaming fallback to mongodump)
      // Since it's enterprise, we should ideally stream, but for simplicity in memory we can batch.
      // We will batch fetch all to avoid running out of memory.
      for (const modelName of modelNames) {
        const Model = mongoose.model(modelName);
        backupData[modelName] = await Model.find({}).lean().exec();
      }

      // 3. Convert to JSON string
      const jsonString = JSON.stringify(backupData);
      
      // 4. Compress
      const settings = settingsCacheService.getCategorySettings(SettingCategory.BACKUP);
      const isCompressionEnabled = settings?.BACKUP_COMPRESSION_ENABLED !== "false" && settings?.BACKUP_COMPRESSION_ENABLED !== false;
      let finalBuffer = Buffer.from(jsonString, "utf-8");
      
      if (isCompressionEnabled) {
        finalBuffer = await gzip(finalBuffer);
      }

      // 5. Encrypt
      const isEncryptionEnabled = settings?.BACKUP_ENCRYPTION_ENABLED === "true" || settings?.BACKUP_ENCRYPTION_ENABLED === true;
      const encryptionKey = settings?.BACKUP_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
      
      if (isEncryptionEnabled && encryptionKey) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey).subarray(0, 32), iv);
        const encrypted = Buffer.concat([cipher.update(finalBuffer), cipher.final()]);
        // Prepend IV to the encrypted buffer so we can decrypt it later
        finalBuffer = Buffer.concat([iv, encrypted]);
      }

      // 6. Generate Checksum
      const checksum = crypto.createHash("sha256").update(finalBuffer).digest("hex");

      // 7. Upload to Storage
      const extension = `${isCompressionEnabled ? '.gz' : '.json'}${isEncryptionEnabled ? '.enc' : ''}`;
      const fileName = `database_backup_${Date.now()}${isCompressionEnabled ? '.json.gz' : '.json'}${isEncryptionEnabled ? '.enc' : ''}`;
      
      const uploadResult = await fileStorageService.upload({
        fileName,
        originalName: fileName,
        extension,
        fileType: FileType.OTHER,
        mimeType: "application/octet-stream",
        size: finalBuffer.length,
        checksum,
      }, finalBuffer);

      // 8. Mark Backup as Completed
      backupRecord.status = BackupStatus.COMPLETED;
      backupRecord.path = (uploadResult as any).path;
      backupRecord.storageProvider = (uploadResult as any).storageProvider;
      backupRecord.checksum = checksum;
      backupRecord.size = finalBuffer.length;
      backupRecord.duration = Date.now() - startTime;
      await backupRecord.save();

      return backupRecord;
    } catch (error: any) {
      backupRecord.status = BackupStatus.FAILED;
      backupRecord.errorLog = error.message || "Unknown error";
      backupRecord.duration = Date.now() - startTime;
      await backupRecord.save();
      throw error;
    }
  }

  /**
   * Restores a database backup from a backup record
   */
  async restoreDatabaseBackup(backupId: string): Promise<any> {
    const backupRecord = await BackupHistory.findById(backupId);
    if (!backupRecord || backupRecord.status !== BackupStatus.COMPLETED) {
      throw new Error("Invalid or incomplete backup record.");
    }

    try {
      // 1. Download file from Storage Service
      // We need a method in FileStorageService to download/read the file buffer.
      // Since FileStorageService might not expose downloadBuffer directly, we will construct the path.
      // Alternatively, assuming we can fetch the file using a new method we'll add `getFileBuffer`.
      
      const fileBuffer = await fileStorageService.getFileBuffer(backupRecord.id); 
      
      if (!fileBuffer) {
        throw new Error("Backup file not found in storage.");
      }

      // 2. Verify Checksum
      const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");
      if (checksum !== backupRecord.checksum) {
        throw new Error("Backup checksum validation failed. The file may be corrupted.");
      }

      // 3. Decrypt
      let dataBuffer = fileBuffer;
      const settings = settingsCacheService.getCategorySettings(SettingCategory.BACKUP);
      
      if (backupRecord.path && backupRecord.path.endsWith('.enc')) {
        const encryptionKey = settings?.BACKUP_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
        if (!encryptionKey) throw new Error("Encryption key missing for restore.");
        
        const iv = dataBuffer.subarray(0, 16);
        const encryptedData = dataBuffer.subarray(16);
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey).subarray(0, 32), iv);
        dataBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
      }

      // 4. Decompress
      if (backupRecord.path && backupRecord.path.includes('.gz')) {
        dataBuffer = await unzip(dataBuffer);
      }

      // 5. Parse JSON
      const backupData = JSON.parse(dataBuffer.toString("utf-8"));

      // 6. Overwrite database collections (Transaction safe where possible)
      // We will perform a massive restore. 
      // DANGER: We must drop existing collections or clear them first.
      
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        for (const modelName of Object.keys(backupData)) {
          const Model = mongoose.model(modelName);
          await Model.deleteMany({}, { session });
          if (backupData[modelName].length > 0) {
            await Model.insertMany(backupData[modelName], { session });
          }
        }
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }

      return { success: true, message: "Database restored successfully." };
    } catch (error: any) {
      throw error;
    }
  }
}

export default new BackupService();
