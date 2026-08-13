import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import systemSettingsRepository from "./systemSettings.repository";

import {
    ISystemSetting,
    SettingCategory,
} from "./systemSettings.types";

import { BaseService } from "../../common/base.service";
import configurationHistoryService from "./configurationHistory.service";

class SystemSettingsService extends BaseService<ISystemSetting> {
    constructor() {
        super(systemSettingsRepository, "System Setting");
    }

    /*
    |--------------------------------------------------------------------------
    | Create Setting
    |--------------------------------------------------------------------------
    */

    // @ts-ignore
    async create(
        payload: ISystemSetting,
        createdBy: string
    ) {
        const exists = await systemSettingsRepository.findByKey(
            payload.key
        );

        if (exists) {
            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Setting already exists."
            );
        }

        const setting = await systemSettingsRepository.create({
            ...payload,
            createdBy,
            updatedBy: createdBy,
        });

        // Log the creation
        await configurationHistoryService.logChange({
            configurationName: payload.key,
            module: payload.category || SettingCategory.GENERAL,
            category: payload.category || SettingCategory.GENERAL,
            changedBy: createdBy,
            oldValue: null,
            newValue: payload.value,
        });

        return setting;
    }



    /*
    |--------------------------------------------------------------------------
    | Get Setting By Key
    |--------------------------------------------------------------------------
    */

    async getByKey(key: string) {
        const setting = await systemSettingsRepository.findByKey(key);

        if (!setting) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Setting not found."
            );
        }

        return setting;
    }



    /*
    |--------------------------------------------------------------------------
    | Get Settings By Category
    |--------------------------------------------------------------------------
    */

    async getByCategory(category: SettingCategory) {
        return systemSettingsRepository.findByCategory(category);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Setting
    |--------------------------------------------------------------------------
    */

    // @ts-ignore
    async update(
        id: string,
        payload: Partial<ISystemSetting>,
        updatedBy: string
    ) {
        const setting = await super.getById(id) as any;

        if (!setting.isEditable) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "This setting cannot be modified."
            );
        }

        const updated = await systemSettingsRepository.updateById(
            id,
            {
                ...payload,
                updatedBy,
            }
        );

        // Log the change
        if (payload.value !== undefined && JSON.stringify(setting.value) !== JSON.stringify(payload.value)) {
            await configurationHistoryService.logChange({
                configurationName: setting.key,
                module: setting.category,
                category: setting.category,
                changedBy: updatedBy,
                oldValue: setting.value,
                newValue: payload.value,
            });
        }

        return updated;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Setting By Key
    |--------------------------------------------------------------------------
    */

    async updateByKey(
        key: string,
        payload: Partial<ISystemSetting>,
        updatedBy: string
    ) {
        const setting = await this.getByKey(key) as any;

        if (!setting.isEditable) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "This setting cannot be modified."
            );
        }

        const updated = await systemSettingsRepository.updateByKey(
            key,
            {
                ...payload,
                updatedBy,
            }
        );

        // Log the change
        if (payload.value !== undefined && JSON.stringify(setting.value) !== JSON.stringify(payload.value)) {
            await configurationHistoryService.logChange({
                configurationName: key,
                module: setting.category,
                category: setting.category,
                changedBy: updatedBy,
                oldValue: setting.value,
                newValue: payload.value,
            });
        }

        return updated;
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Setting
    |--------------------------------------------------------------------------
    */

    // @ts-ignore
    async delete(id: string) {
        const setting = await super.getById(id) as any;

        if (!setting.isEditable) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "This setting cannot be deleted."
            );
        }

        await systemSettingsRepository.deleteById(id);

        return {
            deleted: true,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Setting By Key
    |--------------------------------------------------------------------------
    */

    async deleteByKey(key: string) {
        const setting = await this.getByKey(key) as any;

        if (!setting.isEditable) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "This setting cannot be deleted."
            );
        }

        await systemSettingsRepository.deleteByKey(key);

        return {
            deleted: true,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Reset Category
    |--------------------------------------------------------------------------
    */

    async resetCategory(category: SettingCategory) {
        await systemSettingsRepository.resetCategory(category);

        return {
            success: true,
            message: `${category} settings reset successfully.`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Get Public Settings
    |--------------------------------------------------------------------------
    */

    async getPublicSettings() {
        return systemSettingsRepository.findAll({
            $or: [
                { visibility: "PUBLIC" },
                { category: SettingCategory.ORGANIZATION }
            ],
            isActive: true,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Export Settings
    |--------------------------------------------------------------------------
    */

    async exportSettings() {
        return systemSettingsRepository.findAll();
    }

    /*
    |--------------------------------------------------------------------------
    | Import Settings
    |--------------------------------------------------------------------------
    */

    async importSettings(
        settings: ISystemSetting[],
        createdBy: string
    ) {
        const imported = [];

        for (const setting of settings) {
            const exists = await systemSettingsRepository.findByKey(
                setting.key
            );

            if (exists) {
                const updated = await systemSettingsRepository.updateByKey(
                    setting.key,
                    {
                        ...setting,
                        updatedBy: createdBy,
                    }
                );
                imported.push(updated);
            } else {
                const created = await systemSettingsRepository.create({
                    ...setting,
                    createdBy,
                    updatedBy: createdBy,
                });
                imported.push(created);
            }
        }

        return imported;
    }
}

export default new SystemSettingsService();
