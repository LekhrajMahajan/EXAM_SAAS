import mongoose, { ClientSession } from "mongoose";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import activityLogRepository, {
    ActivityLogQuery,
} from "./activityLog.repository";

import {
    ActivityLogDocument,
    ActivityPriority,
    ActivityType,
    ActivityVisibility,
    IActivityLog,
} from "./activityLog.types";

import { BaseService } from "../../common/base.service";

class ActivityLogService extends BaseService<IActivityLog> {
    constructor() {
        super(activityLogRepository, "Activity log");
    }


    /*
    |--------------------------------------------------------------------------
    | Log Activity
    |--------------------------------------------------------------------------
    */
    async log(
        payload: Partial<IActivityLog>
    ) {
        try {
            const activity =
                await super.create(
                    {
                        ...payload,
                        priority:
                            payload.priority ??
                            ActivityPriority.MEDIUM,
                        visibility:
                            payload.visibility ??
                            ActivityVisibility.COMPANY,
                    }
                );
            return activity;
        } catch (error) {
            console.error("Error logging activity:", error);
            // throw error; // don't crash the app for an activity log failure
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Create Activity Helper
    |--------------------------------------------------------------------------
    */
    async createActivity(
        module: string,
        activityType: ActivityType,
        title: string,
        description: string,
        performedBy: string,
        metadata?: Record<string, unknown>
    ) {
        return this.log({
            module,
            activityType,
            title,
            description,
            performedBy: new mongoose.Types.ObjectId(
                performedBy
            ),
            metadata,
        });
    }



    /*
    |--------------------------------------------------------------------------
    | Get User Activities
    |--------------------------------------------------------------------------
    */
    async getByUser(
        userId: string
    ) {
        return activityLogRepository.findByUser(
            userId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Module Activities
    |--------------------------------------------------------------------------
    */
    async getByModule(
        module: string
    ) {
        return activityLogRepository.findByModule(
            module
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Recent Activities
    |--------------------------------------------------------------------------
    */
    async getRecent(
        limit = 10
    ) {
        return activityLogRepository.findRecent(
            limit
        );
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
            createActivities,
            updateActivities,
            highPriorityActivities,
        ] = await Promise.all([
            activityLogRepository.count(
                companyId
            ),
            activityLogRepository.countByType(
                ActivityType.CREATE,
                companyId
            ),
            activityLogRepository.countByType(
                ActivityType.UPDATE,
                companyId
            ),
            activityLogRepository.countByPriority(
                ActivityPriority.HIGH,
                companyId
            ),
        ]);

        return {
            total,
            createActivities,
            updateActivities,
            highPriorityActivities,
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
        const dashboard =
            await this.dashboard(
                companyId
            );

        const createPercentage =
            dashboard.total === 0
                ? 0
                : Number(
                    (
                        dashboard.createActivities /
                        dashboard.total
                    ) * 100
                ).toFixed(2);

        const updatePercentage =
            dashboard.total === 0
                ? 0
                : Number(
                    (
                        dashboard.updateActivities /
                        dashboard.total
                    ) * 100
                ).toFixed(2);

        const highPriorityPercentage =
            dashboard.total === 0
                ? 0
                : Number(
                    (
                        dashboard.highPriorityActivities /
                        dashboard.total
                    ) * 100
                ).toFixed(2);

        return {
            ...dashboard,
            createPercentage,
            updatePercentage,
            highPriorityPercentage,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */
    async softDelete(
        activityId: string
    ) {
        return super.delete(
            activityId
        );
    }



    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */
    async permanentDelete(
        activityId: string
    ) {
        await super.getById(activityId);

        return activityLogRepository.permanentDelete(
            activityId
        );
    }
}

export default new ActivityLogService();
