import {
    ClientSession,
    QueryFilter as FilterQuery,
    Types,
} from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import ActivityLog from "./activityLog.model";

import {
    ActivityLogDocument,
    ActivityPriority,
    ActivityType,
    ActivityVisibility,
    IActivityLog,
} from "./activityLog.types";

export interface ActivityLogQuery {
    page?: number;
    limit?: number;
    companyId?: string;
    branchId?: string;
    examId?: string;
    candidateId?: string;
    employeeId?: string;
    performedBy?: string;
    module?: string;
    activityType?: ActivityType;
    priority?: ActivityPriority;
    visibility?: ActivityVisibility;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}

class ActivityLogRepository extends BaseRepository<IActivityLog> {
    constructor() {
        super(ActivityLog, [
            "performedBy",
            "companyId",
            "branchId",
            "candidateId",
            "employeeId",
            "examId"
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */
    async findDeletedById(
        id: string
    ) {
        return ActivityLog.findOne({
            _id: id,
            isDeleted: true,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Find By User
    |--------------------------------------------------------------------------
    */
    async findByUser(
        userId: string
    ) {
        return ActivityLog.find({
            performedBy: new Types.ObjectId(userId),
            isDeleted: false,
        })
        .sort({
            createdAt: -1,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Find By Module
    |--------------------------------------------------------------------------
    */
    async findByModule(
        module: string
    ) {
        return ActivityLog.find({
            module,
            isDeleted: false,
        })
        .sort({
            createdAt: -1,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Find Recent
    |--------------------------------------------------------------------------
    */
    async findRecent(
        limit = 10
    ) {
        return ActivityLog.find({
            isDeleted: false,
        })
        .populate("performedBy")
        .populate("candidateId")
        .populate("employeeId")
        .populate("examId")
        .sort({
            createdAt: -1,
        })
        .limit(limit);
    }

    /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */
    async findAll(
        query: ActivityLogQuery & { [key: string]: any }
    ) {
        const {
            page = 1,
            limit = 20,
            companyId,
            branchId,
            examId,
            candidateId,
            employeeId,
            performedBy,
            module,
            activityType,
            priority,
            visibility,
            startDate,
            endDate,
            search,
        } = query;

        const filter: FilterQuery<ActivityLogDocument> = {
            isDeleted: false,
        };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { module: { $regex: search, $options: "i" } },
                { activityType: { $regex: search, $options: "i" } },
            ];
        }

        if (companyId)
            filter.companyId = new Types.ObjectId(companyId);
        if (branchId)
            filter.branchId = new Types.ObjectId(branchId);
        if (examId)
            filter.examId = new Types.ObjectId(examId);
        if (candidateId)
            filter.candidateId = new Types.ObjectId(candidateId);
        if (employeeId)
            filter.employeeId = new Types.ObjectId(employeeId);
        if (performedBy)
            filter.performedBy = new Types.ObjectId(performedBy);
        if (module)
            filter.module = module;
        if (activityType)
            filter.activityType = activityType;
        if (priority)
            filter.priority = priority;
        if (visibility)
            filter.visibility = visibility;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = startDate;
            if (endDate)
                filter.createdAt.$lte = endDate;
        }

        const total =
            await ActivityLog.countDocuments(filter);

        const data =
            await ActivityLog.find(filter)
                .populate("performedBy")
                .populate("companyId")
                .populate("branchId")
                .populate("candidateId")
                .populate("employeeId")
                .populate("examId")
                .sort({
                    createdAt: -1,
                })
                .skip((page - 1) * limit)
                .limit(limit);

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Count
    |--------------------------------------------------------------------------
    */
    async count(
        companyId?: any
    ) {
        if (typeof companyId === 'object') {
            return super.count(companyId);
        }
        
        const filter: FilterQuery<ActivityLogDocument> = {
            isDeleted: false,
        };
        if (companyId) {
            filter.companyId = new Types.ObjectId(companyId);
        }
        return ActivityLog.countDocuments(filter);
    }

    /*
    |--------------------------------------------------------------------------
    | Count By Type
    |--------------------------------------------------------------------------
    */
    async countByType(
        activityType: ActivityType,
        companyId?: string
    ) {
        const filter: FilterQuery<ActivityLogDocument> = {
            activityType,
            isDeleted: false,
        };
        if (companyId) {
            filter.companyId = new Types.ObjectId(companyId);
        }
        return ActivityLog.countDocuments(filter);
    }

    /*
    |--------------------------------------------------------------------------
    | Count By Priority
    |--------------------------------------------------------------------------
    */
    async countByPriority(
        priority: ActivityPriority,
        companyId?: string
    ) {
        const filter: FilterQuery<ActivityLogDocument> = {
            priority,
            isDeleted: false,
        };
        if (companyId) {
            filter.companyId = new Types.ObjectId(companyId);
        }
        return ActivityLog.countDocuments(filter);
    }

    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */
    async permanentDelete(
        id: string
    ) {
        return ActivityLog.findByIdAndDelete(id);
    }
}

export default new ActivityLogRepository();
