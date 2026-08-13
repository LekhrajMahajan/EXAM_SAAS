import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { BaseService } from "../../common/base.service";
import configurationHistoryRepository from "./configurationHistory.repository";
import systemSettingsService from "./systemSettings.service";
import { IConfigurationHistory, ConfigurationStatus, ConfigurationApprovalStatus } from "./configurationHistory.types";
import { SettingCategory } from "./systemSettings.types";
import mongoose from "mongoose";

class ConfigurationHistoryService extends BaseService<IConfigurationHistory> {
  constructor() {
    super(configurationHistoryRepository, "Configuration History");
  }

  async logChange({
    configurationName,
    module,
    category,
    changedBy,
    oldValue,
    newValue,
    reason,
    rollbackPoint = false,
  }: {
    configurationName: string;
    module: SettingCategory;
    category: SettingCategory;
    changedBy: string;
    oldValue: any;
    newValue: any;
    reason?: string;
    rollbackPoint?: boolean;
  }) {
    const latestVersion = await configurationHistoryRepository.getLatestVersion(configurationName);

    return configurationHistoryRepository.create({
      configurationName,
      module,
      category,
      changedBy: new mongoose.Types.ObjectId(changedBy) as any,
      oldValue,
      newValue,
      status: rollbackPoint ? ConfigurationStatus.ROLLBACK : ConfigurationStatus.PUBLISHED,
      approvalStatus: ConfigurationApprovalStatus.NOT_REQUIRED, // Customize based on module requirements
      reason: reason || "System configuration updated",
      version: latestVersion + 1,
      rollbackPoint,
    } as IConfigurationHistory);
  }

  async getHistory(filters: any = {}, options: any = {}) {
    if (!options.populate) {
      options.populate = [
        { path: "changedBy", select: "firstName lastName email" },
        { path: "reviewer", select: "firstName lastName email" },
      ];
    }
    return configurationHistoryRepository.findWithFilters(filters, options);
  }

  async compareVersions(id1: string, id2: string) {
    const [v1, v2] = await Promise.all([
      super.getById(id1),
      super.getById(id2),
    ]);

    if (!v1 || !v2) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "One or both configuration versions not found.");
    }

    return {
      v1: v1.newValue,
      v2: v2.newValue,
      diff: this.calculateDiff(v1.newValue, v2.newValue),
    };
  }

  private calculateDiff(obj1: any, obj2: any) {
    // Simple top-level diff for now, can be extended to deep diff
    const diff: any = {};
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    keys.forEach((key) => {
      if (JSON.stringify(obj1?.[key]) !== JSON.stringify(obj2?.[key])) {
        diff[key] = {
          old: obj1?.[key],
          new: obj2?.[key],
        };
      }
    });

    return diff;
  }

  async rollback(id: string, user: string, reason?: string) {
    const history = await super.getById(id);

    if (!history) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Configuration history record not found.");
    }

    // Restore the setting in systemSettings Service
    // The configurationName corresponds to the Setting Key
    await systemSettingsService.updateByKey(
      history.configurationName,
      { value: history.oldValue },
      user
    ); // The updateByKey will trigger a new logChange which is correct.

    return {
      success: true,
      message: "Configuration successfully rolled back.",
    };
  }

  async approve(id: string, status: ConfigurationApprovalStatus, reviewer: string, notes?: string) {
    const history = await super.getById(id) as any;

    if (!history) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Configuration history record not found.");
    }

    return configurationHistoryRepository.update(id, {
      approvalStatus: status,
      reviewer: new mongoose.Types.ObjectId(reviewer) as any,
      approvalNotes: notes,
      approvalTimestamp: new Date(),
    } as any);
  }
}

export default new ConfigurationHistoryService();
