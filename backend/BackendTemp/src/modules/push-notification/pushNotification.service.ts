import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    ISendPushNotification,
    NotificationPriority,
    PushNotificationType,
    PushProvider,
} from "./pushNotification.types";

class PushNotificationService {

    constructor() {

        if (!getApps().length) {
            if (
                process.env.FCM_PROJECT_ID &&
                process.env.FCM_CLIENT_EMAIL &&
                process.env.FCM_PRIVATE_KEY
            ) {
                initializeApp({
                    credential: cert({
                        project_id: process.env.FCM_PROJECT_ID,
                        client_email: process.env.FCM_CLIENT_EMAIL,
                        private_key: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n"),
                    } as any),
                });
            } else {
                // console.warn(
                //     "[PushNotificationService] FCM credentials missing in .env, push notifications will not work."
                // );
            }
        }

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Provider
    |--------------------------------------------------------------------------
    */

    private validateProvider(
        provider?: PushProvider
    ) {

        if (!provider) {

            return PushProvider.FCM;

        }

        return provider;

    }

    /*
    |--------------------------------------------------------------------------
    | Send Notification
    |--------------------------------------------------------------------------
    */

    async send(
        payload: ISendPushNotification
    ) {

        this.validateProvider(
            payload.provider
        );

        // Fire and forget async IIFE
        (async () => {
            try {
                await getMessaging().send({
                    token: payload.token as string,
                    notification: {
                        title: payload.title,
                        body: payload.body,
                        imageUrl: payload.image,
                    },
                    data: payload.data,
                    android: {
                        priority: payload.priority === NotificationPriority.HIGH ? "high" : "normal",
                    },
                });
            } catch (error: any) {
                console.error("[PushNotificationService] Failed to send notification:", error.message);
            }
        })();

        return {
            success: true,
            message: "Push notification queued.",
        };

    }

    /*
    |--------------------------------------------------------------------------
    | Send Bulk Notification
    |--------------------------------------------------------------------------
    */

    async sendBulk(
        payload: ISendPushNotification
    ) {

        if (

            !Array.isArray(
                payload.token
            )

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Bulk notification requires multiple device tokens."

            );

        }

        // Fire and forget async IIFE
        (async () => {
            try {
                await getMessaging().sendEachForMulticast({
                    tokens: payload.token as string[],
                    notification: {
                        title: payload.title,
                        body: payload.body,
                        imageUrl: payload.image,
                    },
                    data: payload.data,
                });
            } catch (error: any) {
                console.error("[PushNotificationService] Failed to send bulk notification:", error.message);
            }
        })();

        return {
            successCount: payload.token.length,
            failureCount: 0,
            message: "Bulk notifications queued."
        };

    }

    /*
    |--------------------------------------------------------------------------
    | Exam Reminder
    |--------------------------------------------------------------------------
    */

    async sendExamReminder(

        token: string,

        examId: string

    ) {

        return this.send({

            token,

            title:
                "Exam Reminder",

            body:
                "Your exam is scheduled soon.",

            data: {

                examId,

                type:
                    PushNotificationType.EXAM_REMINDER,

            },

            priority:
                NotificationPriority.HIGH,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Result Notification
    |--------------------------------------------------------------------------
    */

    async sendResultNotification(

        token: string,

        resultId: string

    ) {

        return this.send({

            token,

            title:
                "Result Published",

            body:
                "Your examination result is now available.",

            data: {

                resultId,

                type:
                    PushNotificationType.RESULT,

            },

            priority:
                NotificationPriority.HIGH,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send System Notification
    |--------------------------------------------------------------------------
    */

    async sendSystemNotification(
        payload: ISendPushNotification
    ) {

        return this.send({

            ...payload,

            data: {

                ...payload.data,

                type:
                    PushNotificationType.SYSTEM,

            },

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Custom Notification
    |--------------------------------------------------------------------------
    */

    async sendCustomNotification(
        payload: ISendPushNotification
    ) {

        return this.send({

            ...payload,

            data: {

                ...payload.data,

                type:
                    PushNotificationType.CUSTOM,

            },

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Subscribe Topic
    |--------------------------------------------------------------------------
    */

    async subscribeTopic(

        tokens: string[],

        topic: string

    ) {

        const response =
            await getMessaging()
                .subscribeToTopic(

                    tokens,

                    topic

                );

        return {

            success: true,

            topic,

            successCount:
                response.successCount,

            failureCount:
                response.failureCount,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Unsubscribe Topic
    |--------------------------------------------------------------------------
    */

    async unsubscribeTopic(

        tokens: string[],

        topic: string

    ) {

        const response =
            await getMessaging()
                .unsubscribeFromTopic(

                    tokens,

                    topic

                );

        return {

            success: true,

            topic,

            successCount:
                response.successCount,

            failureCount:
                response.failureCount,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Send Topic Notification
    |--------------------------------------------------------------------------
    */

    async sendTopicNotification(

        topic: string,

        title: string,

        body: string,

        data?: Record<string, string>

    ) {

        await getMessaging()
            .send({

                topic,

                notification: {

                    title,

                    body,

                },

                data,

            });

        return {

            success: true,

            message:
                "Topic notification sent successfully.",

        };

    }

}

export default new PushNotificationService();
