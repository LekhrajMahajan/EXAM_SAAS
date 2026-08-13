import mongoose, { ClientSession } from "mongoose";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import notificationRepository, {
    NotificationQuery,
} from "./notification.repository";

import {
    INotification,
    NotificationStatus,
    NotificationPriority,
} from "./notification.types";
import { BaseService } from "../../common/base.service";

class NotificationService extends BaseService<INotification> {
    constructor() {
        super(notificationRepository, "Notification");
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Notification
    |--------------------------------------------------------------------------
    */

    private async validateNotification(
        notificationId: string
    ) {

        const notification =
            await notificationRepository.findById(
                notificationId
            );

        if (!notification) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "Notification not found."

            );

        }

        return notification;

    }

    /*
    |--------------------------------------------------------------------------
    | Create Notification
    |--------------------------------------------------------------------------
    */

    async create(
        payload: Partial<INotification>
    ) {
        try {
            const notification =
                await super.create(
                    {
                        ...payload,
                        priority:
                            payload.priority ??
                            NotificationPriority.MEDIUM,
                        status:
                            NotificationStatus.PENDING,
                        retryCount: 0,
                    }
                );
            return notification;
        } catch (error) {
            throw error;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Send Notification
    |--------------------------------------------------------------------------
    */

    async send(
        notificationId: string
    ) {

        const notification =
            await this.validateNotification(
                notificationId
            );

        if (

            notification.status ===
            NotificationStatus.SENT

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Notification already sent."

            );

        }

        const settingsCache = require("../system-settings/settingsCache.service").default;
        const globalEnabled = settingsCache.get('NOTIFICATIONS_ENABLED', 'true') === 'true';

        if (!globalEnabled) {
             return notificationRepository.update(
                notificationId,
                {
                    status: NotificationStatus.CANCELLED,
                    failureReason: "Notifications globally disabled by system settings"
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Delivery Provider
        |--------------------------------------------------------------------------
        |
        | Email
        | SMS
        | WhatsApp
        | Push
        | In-App
        |
        */
        
        // Example check:
        // const type = notification.type; // Assuming type exists (EMAIL, SMS, etc.)
        // if (type === 'EMAIL' && settingsCache.get('NOTIFICATIONS_ENABLE_EMAIL', 'true') !== 'true') return cancel...

        return notificationRepository.update(

            notificationId,

            {

                status:
                    NotificationStatus.SENT,

                sentAt:
                    new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Send
    |--------------------------------------------------------------------------
    */

    async bulkSend(
        notificationIds: string[]
    ) {

        const results = [];

        for (

            const id of notificationIds

        ) {

            try {

                const response =
                    await this.send(id);

                results.push({

                    id,

                    success: true,

                    data: response,

                });

            } catch (error: any) {

                results.push({

                    id,

                    success: false,

                    error: error.message,

                });

            }

        }

        return results;

    }

    /*
    |--------------------------------------------------------------------------
    | Schedule Notification
    |--------------------------------------------------------------------------
    */

    async schedule(

        notificationId: string,

        scheduledAt: Date

    ) {

        await this.validateNotification(
            notificationId
        );

        return notificationRepository.update(

            notificationId,

            {

                status:
                    NotificationStatus.QUEUED,

                scheduledAt,

            }

        );

    }

  /*
    |--------------------------------------------------------------------------
    | Get By Recipient
    |--------------------------------------------------------------------------
    */

    async getByRecipient(
        recipientId: string
    ) {

        return notificationRepository.findByRecipient(
            recipientId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get By Candidate
    |--------------------------------------------------------------------------
    */

    async getByCandidate(
        candidateId: string
    ) {

        return notificationRepository.findByCandidate(
            candidateId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get By Employee
    |--------------------------------------------------------------------------
    */

    async getByEmployee(
        employeeId: string
    ) {

        return notificationRepository.findByEmployee(
            employeeId
        );

    }

  /*
    |--------------------------------------------------------------------------
    | Mark As Read
    |--------------------------------------------------------------------------
    */

    async markAsRead(
        notificationId: string
    ) {

        const notification =
            await this.validateNotification(
                notificationId
            );

        if (
            notification.status ===
            NotificationStatus.READ
        ) {

            return notification;

        }

        return notificationRepository.update(

            notificationId,

            {

                status:
                    NotificationStatus.READ,

                readAt:
                    new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Notification
    |--------------------------------------------------------------------------
    */

    async cancel(
        notificationId: string
    ) {

        const notification =
            await this.validateNotification(
                notificationId
            );

        if (
            notification.status ===
            NotificationStatus.DELIVERED
        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Delivered notification cannot be cancelled."

            );

        }

        if (
            notification.status ===
            NotificationStatus.READ
        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Read notification cannot be cancelled."

            );

        }

        return notificationRepository.update(

            notificationId,

            {

                status:
                    NotificationStatus.CANCELLED,

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Retry Failed Notification
    |--------------------------------------------------------------------------
    */

    async retryFailed(
        notificationId: string
    ) {

        const notification =
            await this.validateNotification(
                notificationId
            );

        if (
            notification.status !==
            NotificationStatus.FAILED
        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Notification is not in failed state."

            );

        }

        return notificationRepository.update(

            notificationId,

            {

                status:
                    NotificationStatus.QUEUED,

                retryCount:
                    notification.retryCount + 1,

                failureReason:
                    undefined,

            }

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

            sent,

            delivered,

            failed,

        ] = await Promise.all([

            notificationRepository.count(
                companyId ? { companyId } : undefined
            ),

            notificationRepository.countSent(
                companyId
            ),

            notificationRepository.countDelivered(
                companyId
            ),

            notificationRepository.countFailed(
                companyId
            ),

        ]);

        return {

            total,

            sent,

            delivered,

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

        const sentRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        dashboard.sent /

                        dashboard.total

                    ) * 100

                ).toFixed(2);

        const deliveryRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        dashboard.delivered /

                        dashboard.total

                    ) * 100

                ).toFixed(2);

        const failureRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        dashboard.failed /

                        dashboard.total

                    ) * 100

                ).toFixed(2);

        return {

            ...dashboard,

            sentRate,

            deliveryRate,

            failureRate,

        };

    }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    async permanentDelete(
        notificationId: string
    ) {

        await this.validateNotification(
            notificationId
        );

        return notificationRepository.permanentDelete(
            notificationId
        );

    }

}

export default new NotificationService();
