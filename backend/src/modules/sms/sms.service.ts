import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    ISendSms,
    SmsPriority,
    SmsProvider,
    SmsTemplate,
} from "./sms.types";

import { decrypt } from "../../utils/decrypt";
import settingsCacheService from "../system-settings/settingsCache.service";

class SmsService {

    /*
    |--------------------------------------------------------------------------
    | Validate Provider
    |--------------------------------------------------------------------------
    */

    private validateProvider(
        provider?: SmsProvider
    ) {

        if (!provider) {

            return SmsProvider.MSG91;

        }

        return provider;

    }

    /*
    |--------------------------------------------------------------------------
    | Send SMS
    |--------------------------------------------------------------------------
    */

    async send(payload: ISendSms) {
        this.validateProvider(payload.provider);

        const isSmsEnabled = settingsCacheService.get("NOTIFICATIONS_ENABLE_SMS", "true") === "true";
        if (!isSmsEnabled) {
            console.log(`[SmsService] SMS sending is globally disabled via settings. Skipping SMS to ${payload.phone}`);
            return {
                success: false,
                message: "SMS notifications are disabled."
            };
        }

        const provider = settingsCacheService.get("SMS_PROVIDER", "MSG91");
        const apiUrl = settingsCacheService.get("SMS_API_URL", "");
        const apiKey = settingsCacheService.get("SMS_API_KEY", "");
        
        let apiSecret = settingsCacheService.get("SMS_API_SECRET", "");
        if (apiSecret.includes(":")) {
            apiSecret = decrypt(apiSecret);
        }

        /*
        |--------------------------------------------------------------------------
        | Provider Integration
        |--------------------------------------------------------------------------
        |
        | TODO: Actual HTTP Request to provider
        |
        */
        console.log(`[SmsService] Sending SMS via ${provider} to ${payload.phone}`);

        return {
            success: true,
            provider,
            phone: payload.phone,
            message: payload.message,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Send Bulk SMS
    |--------------------------------------------------------------------------
    */

    async sendBulk(
        payload: ISendSms
    ) {

        if (

            !Array.isArray(
                payload.phone
            )

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Bulk SMS requires multiple phone numbers."

            );

        }

        const result = [];

        for (

            const phone of payload.phone

        ) {

            result.push(

                await this.send({

                    ...payload,

                    phone,

                })

            );

        }

        return result;

    }

    /*
    |--------------------------------------------------------------------------
    | Send OTP
    |--------------------------------------------------------------------------
    */

    async sendOtp(

        phone: string,

        otp: string

    ) {

        return this.send({

            phone,

            message:

                `Your OTP is ${otp}.`,

            template:

                SmsTemplate.OTP,

            priority:

                SmsPriority.HIGH,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Welcome SMS
    |--------------------------------------------------------------------------
    */

    async sendWelcome(
        phone: string
    ) {

        return this.send({

            phone,

            message:

                "Welcome to Exam SaaS.",

            template:

                SmsTemplate.WELCOME,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Password Reset
    |--------------------------------------------------------------------------
    */

    async sendPasswordReset(

        phone: string,

        resetLink: string

    ) {

        return this.send({

            phone,

            message:

                `Reset your password: ${resetLink}`,

            template:

                SmsTemplate.PASSWORD_RESET,

            priority:

                SmsPriority.HIGH,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Account Verification
    |--------------------------------------------------------------------------
    */

    async sendAccountVerification(
        phone: string
    ) {

        return this.send({

            phone,

            message:
                "Your account has been verified successfully.",

            template:
                SmsTemplate.ACCOUNT_VERIFICATION,

            priority:
                SmsPriority.HIGH,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Exam Schedule
    |--------------------------------------------------------------------------
    */

    async sendExamSchedule(
        payload: ISendSms
    ) {

        return this.send({

            ...payload,

            template:
                SmsTemplate.EXAM_SCHEDULE,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Admit Card
    |--------------------------------------------------------------------------
    */

    async sendAdmitCard(
        payload: ISendSms
    ) {

        return this.send({

            ...payload,

            template:
                SmsTemplate.ADMIT_CARD,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Result
    |--------------------------------------------------------------------------
    */

    async sendResult(
        payload: ISendSms
    ) {

        return this.send({

            ...payload,

            template:
                SmsTemplate.RESULT,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Certificate
    |--------------------------------------------------------------------------
    */

    async sendCertificate(
        payload: ISendSms
    ) {

        return this.send({

            ...payload,

            template:
                SmsTemplate.CERTIFICATE,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Send Custom SMS
    |--------------------------------------------------------------------------
    */

    async sendCustom(
        payload: ISendSms
    ) {

        return this.send(payload);

    }

}

export default new SmsService();
