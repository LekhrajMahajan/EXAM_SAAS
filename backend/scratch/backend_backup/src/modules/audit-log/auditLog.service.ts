import mongoose, { ClientSession } from "mongoose";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import auditLogRepository, {
    AuditLogQuery,
} from "./auditLog.repository";

import {
    AuditAction,
    AuditSeverity,
    AuditStatus,
    IAuditLog,
} from "./auditLog.types";

import { BaseService } from "../../common/base.service";

class AuditLogService extends BaseService<IAuditLog> {
    constructor() {
        super(auditLogRepository, "Audit log");
    }



    /*
    |--------------------------------------------------------------------------
    | Log
    |--------------------------------------------------------------------------
    */

    async log(
        payload: Partial<IAuditLog>
    ) {
        try {
            const audit =
                await super.create(
                    {
                        ...payload,
                        severity:
                            payload.severity ??
                            AuditSeverity.LOW,
                        status:
                            payload.status ??
                            AuditStatus.SUCCESS,
                    }
                );
            return audit;
        } catch (error) {
            console.error("Error logging audit:", error);
            // throw error; // don't crash the app for an audit log failure
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Log Success
    |--------------------------------------------------------------------------
    */

    async logSuccess(

        payload: Partial<IAuditLog>

    ) {

        return this.log({

            ...payload,

            status:
                AuditStatus.SUCCESS,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Log Failure
    |--------------------------------------------------------------------------
    */

    async logFailure(

        payload: Partial<IAuditLog>

    ) {

        return this.log({

            ...payload,

            status:
                AuditStatus.FAILED,

            severity:

                payload.severity ??

                AuditSeverity.HIGH,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Create Action Log Helper
    |--------------------------------------------------------------------------
    */

    async createActionLog(

        module: string,

        action: AuditAction,

        description: string,

        performedBy: string,

        metadata?: Record<string, unknown>

    ) {

        return this.log({

            module,

            action,

            description,

            performedBy:
                new mongoose.Types.ObjectId(
                    performedBy
                ),

            metadata,

            severity:
                AuditSeverity.LOW,

            status:
                AuditStatus.SUCCESS,

        });

    }



    /*
    |--------------------------------------------------------------------------
    | Get By User
    |--------------------------------------------------------------------------
    */

    async getByUser(
        userId: string
    ) {

        return auditLogRepository.findByUser(
            userId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get By Module
    |--------------------------------------------------------------------------
    */

    async getByModule(
        module: string
    ) {

        return auditLogRepository.findByModule(
            module
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

            success,

            failed,

        ] = await Promise.all([

            auditLogRepository.count(
                companyId
            ),

            auditLogRepository.countSuccess(
                companyId
            ),

            auditLogRepository.countFailed(
                companyId
            ),

        ]);

        return {

            total,

            success,

            failed,

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

        const successRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (

                            dashboard.success /

                            dashboard.total

                        ) * 100

                    ).toFixed(2)

                );

        const failureRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (

                            dashboard.failed /

                            dashboard.total

                        ) * 100

                    ).toFixed(2)

                );

        return {

            ...dashboard,

            successRate,

            failureRate,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */

    async softDelete(
        auditId: string
    ) {

        return super.delete(
            auditId
        );

    }



    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    async permanentDelete(
        auditId: string
    ) {

        await super.getById(
            auditId
        );

        return auditLogRepository.permanentDelete(
            auditId
        );

    }

}

export default new AuditLogService();
