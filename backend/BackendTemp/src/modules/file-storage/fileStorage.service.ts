import mongoose, { ClientSession } from "mongoose";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import fileStorageRepository, {
    FileStorageQuery,
} from "./fileStorage.repository";

import {
    FileStatus,
    FileStorageDocument,
    FileType,
    StorageProvider,
    IFileStorage,
} from "./fileStorage.types";

import { BaseService } from "../../common/base.service";
import settingsCacheService from "../system-settings/settingsCache.service";
import { SettingCategory } from "../system-settings/systemSettings.types";
import { decrypt } from "../../utils/decrypt";
import { LocalStorageStrategy } from "./strategies/localStorage.strategy";
import { S3StorageStrategy } from "./strategies/s3Storage.strategy";
import { CloudinaryStorageStrategy } from "./strategies/cloudinaryStorage.strategy";
import { IStorageStrategy } from "./strategies/storageStrategy.interface";

class FileStorageService extends BaseService<IFileStorage> {
    constructor() {
        super(fileStorageRepository, "File");
    }

    private async getActiveStrategy(): Promise<{ strategy: IStorageStrategy, provider: StorageProvider }> {
        const settings = settingsCacheService.getCategorySettings(SettingCategory.STORAGE);
        
        // Decrypt secrets
        if (settings.AWS_S3_SECRET_KEY && settings.AWS_S3_SECRET_KEY.includes(":")) {
            try {
                settings.AWS_S3_SECRET_KEY = decrypt(settings.AWS_S3_SECRET_KEY);
            } catch (e) {
                console.error("Failed to decrypt AWS_S3_SECRET_KEY", e);
            }
        }

        const provider = (settings.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER) as StorageProvider || StorageProvider.LOCAL;
        let strategy: IStorageStrategy;

        switch (provider) {
            case StorageProvider.AWS_S3:
                strategy = new S3StorageStrategy();
                break;
            case StorageProvider.CLOUDINARY:
                strategy = new CloudinaryStorageStrategy();
                break;
            case StorageProvider.LOCAL:
            default:
                strategy = new LocalStorageStrategy();
                break;
        }

        await strategy.initialize(settings);
        return { strategy, provider };
    }


    /*
    |--------------------------------------------------------------------------
    | Upload File
    |--------------------------------------------------------------------------
    */
    async upload(
        payload: Partial<IFileStorage>,
        physicalFile?: Express.Multer.File | Buffer
    ) {
        try {
            if (payload.checksum) {
                const existingFile =
                    await fileStorageRepository.findByChecksum(
                        payload.checksum
                    );

                if (existingFile) {
                    throw new ApiError(
                        HTTP_STATUS.CONFLICT,
                        "File already exists."
                    );
                }
            }

            let fileUrl = payload.url;
            let filePath = payload.path;
            let fileSize = payload.size;
            let storageProvider = payload.storageProvider || StorageProvider.LOCAL;

            if (physicalFile) {
                const { strategy, provider } = await this.getActiveStrategy();
                const uploadResult = await strategy.upload(
                    physicalFile, 
                    payload.originalName || payload.fileName || "unnamed_file", 
                    payload.mimeType || "application/octet-stream", 
                    { isPublic: payload.isPublic }
                );
                
                fileUrl = uploadResult.url;
                filePath = uploadResult.path;
                fileSize = uploadResult.size;
                storageProvider = provider;
            }

            const file =
                await super.create(
                    {
                        ...payload,
                        url: fileUrl,
                        path: filePath,
                        size: fileSize,
                        storageProvider,
                        status: FileStatus.ACTIVE,
                    }
                );

            return file;
        } catch (error) {
            throw error;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Upload
    |--------------------------------------------------------------------------
    */
    async bulkUpload(
        payload: Partial<IFileStorage>[]
    ) {
        try {
            const files =
                await fileStorageRepository.bulkCreate(
                    payload
                );

            return files;
        } catch (error) {
            throw error;
        }
    }



    /*
    |--------------------------------------------------------------------------
    | Download File
    |--------------------------------------------------------------------------
    */
    async download(
        fileId: string
    ) {
        const file =
            await super.getById(
                fileId
            );

        if (
            file.status !== FileStatus.ACTIVE
        ) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "File is not available for download."
            );
        }

        return file;
    }

    /*
    |--------------------------------------------------------------------------
    | Get File Buffer
    |--------------------------------------------------------------------------
    */
    async getFileBuffer(fileId: string): Promise<Buffer> {
        const file = await super.getById(fileId);
        if (!file) throw new ApiError(HTTP_STATUS.NOT_FOUND, "File not found.");
        
        const { strategy } = await this.getActiveStrategy();
        
        const fileKey = file.storageProvider === StorageProvider.AWS_S3 
            ? file.path.split('/').pop() || file.path 
            : file.path;

        const data = await strategy.download(fileKey);
        
        if (Buffer.isBuffer(data)) {
            return data;
        }

        // Convert stream to Buffer
        return new Promise((resolve, reject) => {
            const chunks: any[] = [];
            data.on('data', chunk => chunks.push(chunk));
            data.on('error', reject);
            data.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Preview File
    |--------------------------------------------------------------------------
    */
    async preview(
        fileId: string
    ) {
        const file =
            await super.getById(
                fileId
            );

        if (
            file.status !== FileStatus.ACTIVE
        ) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "File is not available for preview."
            );
        }

        return file;
    }



    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    async dashboard(
        companyId?: string
    ) {
        const [
            total,
            images,
            pdfs,
            documents,
        ] = await Promise.all([
            fileStorageRepository.count(
                companyId
            ),
            fileStorageRepository.countByType(
                FileType.IMAGE,
                companyId
            ),
            fileStorageRepository.countByType(
                FileType.PDF,
                companyId
            ),
            fileStorageRepository.countByType(
                FileType.DOCUMENT,
                companyId
            ),
        ]);

        return {
            total,
            images,
            pdfs,
            documents,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */
    async statistics(
        companyId?: string
    ) {
        const [
            dashboard,
            localStorage,
            cloudinary,
            aws,
        ] = await Promise.all([
            this.dashboard(
                companyId
            ),
            fileStorageRepository.countByProvider(
                StorageProvider.LOCAL,
                companyId
            ),
            fileStorageRepository.countByProvider(
                StorageProvider.CLOUDINARY,
                companyId
            ),
            fileStorageRepository.countByProvider(
                StorageProvider.AWS_S3,
                companyId
            ),
        ]);

        return {
            ...dashboard,
            storageProviders: {
                local: localStorage,
                cloudinary,
                aws,
            },
        };
    }

    async softDelete(
        fileId: string
    ) {
        return super.delete(fileId);
    }

    /*
    |--------------------------------------------------------------------------
    | Update File Metadata
    |--------------------------------------------------------------------------
    */
    async updateMetadata(
        fileId: string,
        payload: Partial<IFileStorage>
    ) {
        await super.getById(fileId);
        return fileStorageRepository.update(fileId, payload);
    }




    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */
    async permanentDelete(
        fileId: string
    ) {
        await super.getById(
            fileId
        );

        return fileStorageRepository.permanentDelete(
            fileId
        );
    }
}

export default new FileStorageService();
