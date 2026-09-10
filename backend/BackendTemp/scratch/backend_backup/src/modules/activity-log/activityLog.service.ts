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
        performedByRole?: string,
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
            performedByRole,
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
        limit = 10,
        filters: Record<string, unknown> = {}
    ) {
        return activityLogRepository.findRecent(
            limit,
            filters
        );
    }



    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    async dashboard(
        filters: Record<string, unknown> = {}
    ) {
        const { companyId, ...rest } = filters;
        const baseFilter: Record<string, unknown> = { ...rest };
        if (companyId) {
            baseFilter.companyId = new mongoose.Types.ObjectId(String(companyId));
        }

        const [
            total,
            createActivities,
            updateActivities,
            highPriorityActivities,
        ] = await Promise.all([
            activityLogRepository.count(baseFilter),
            activityLogRepository.count({ ...baseFilter, activityType: ActivityType.CREATE }),
            activityLogRepository.count({ ...baseFilter, activityType: ActivityType.UPDATE }),
            activityLogRepository.count({ ...baseFilter, priority: ActivityPriority.HIGH }),
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
        filters: Record<string, unknown> = {}
    ) {
        const dashboard = await this.dashboard(filters);

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
