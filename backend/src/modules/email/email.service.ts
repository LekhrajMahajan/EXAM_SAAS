import nodemailer, { Transporter } from "nodemailer";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    EmailPriority,
    EmailProvider,
    EmailTemplate,
    ISendEmail,
} from "./email.types";

import { decrypt } from "../../utils/decrypt";
import settingsCacheService from "../system-settings/settingsCache.service";
import integrationService from "../system-settings/integration.service";
import { IntegrationCategory } from "../system-settings/integration.types";

class EmailService {
    /*
    |--------------------------------------------------------------------------
    | Build Transporter
    |--------------------------------------------------------------------------
    */
    private async getTransporter(): Promise<Transporter | null> {
        // Prefer direct .env configuration if available for guaranteed real email delivery
        const envHost = process.env.SMTP_HOST;
        const envUser = process.env.SMTP_USER;
        const envPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
        const envPort = Number(process.env.SMTP_PORT || "587");

        if (envHost && envUser && envPass) {
            return nodemailer.createTransport({
                host: envHost,
                port: envPort,
                secure: envPort === 465,
                auth: { user: envUser, pass: envPass },
            });
        }

        const integration = await integrationService.getActiveIntegration(IntegrationCategory.EMAIL);
        
        if (!integration || !integration.restApi) {
            // Fallback to old system settings if no integration is configured yet (for backward compatibility)
            const host = (settingsCacheService.get("SMTP_HOST", "") || process.env.SMTP_HOST || "") as string;
            const port = Number(settingsCacheService.get("SMTP_PORT", "") || process.env.SMTP_PORT || "587");
            const user = (settingsCacheService.get("SMTP_USER", "") || process.env.SMTP_USER || "") as string;
            let pass = (settingsCacheService.get("SMTP_PASSWORD", "") || process.env.SMTP_PASS || "") as string;
            if (pass && pass.includes(":") && !process.env.SMTP_PASS) pass = decrypt(pass);

            if (!host) return null;

            return nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });
        }

        const host = integration.restApi.baseUrl; // Using baseUrl for SMTP Host
        const port = integration.restApi.requestTimeout || 587; // Using requestTimeout for port or separate field
        const user = integration.restApi.apiKey || ""; // Using apiKey for username
        const pass = integration.restApi.secret || ""; // Using secret for password

        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Provider
    |--------------------------------------------------------------------------
    */
    private validateProvider(
        provider?: EmailProvider
    ) {
        if (!provider) {
            return EmailProvider.SMTP;
        }

        return provider;
    }

    /*
    |--------------------------------------------------------------------------
    | Build Template
    |--------------------------------------------------------------------------
    */
    private buildTemplate(
        template: EmailTemplate,
        payload: Record<string, unknown>
    ): string {
        switch (template) {
            case EmailTemplate.OTP:
                return `
                    <h2>OTP Verification</h2>
                    <p>Your OTP is <b>${payload.otp}</b></p>
                `;

            case EmailTemplate.WELCOME:
                return `
                    <h2>Welcome</h2>
                    <p>Welcome to our examination platform.</p>
                `;

            case EmailTemplate.PASSWORD_RESET:
                return `
                    <h2>Password Reset</h2>
                    <p>Please reset your password using the provided link.</p>
                `;

            case EmailTemplate.ACCOUNT_VERIFICATION:
                return `
                    <h2>Account Verification</h2>
                    <p>Your account has been verified successfully.</p>
                `;

            default:
                return "";
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Send Email
    |--------------------------------------------------------------------------
    */
    async send(
        payload: ISendEmail
    ) {
        this.validateProvider(
            payload.provider
        );

        const isEmailEnabled = settingsCacheService.get("NOTIFICATIONS_ENABLE_EMAIL", "true") === "true";
        if (!isEmailEnabled) {
             console.log(`[EmailService] Email sending is globally disabled via settings. Skipping email to ${payload.to}`);
             return {
                 success: false,
                 message: "Email notifications are disabled."
             };
        }

        const defaultSenderEmail = (settingsCacheService.get("NOTIFICATIONS_DEFAULT_SENDER_EMAIL", "") as string) || process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@examsaas.com";
        const defaultSenderName = (settingsCacheService.get("NOTIFICATIONS_DEFAULT_SENDER_NAME", "") as string) || "ExamGuard Pro Enterprise";
        
        let fromHeader = defaultSenderEmail;
        if (defaultSenderName && defaultSenderEmail) {
            fromHeader = `"${defaultSenderName}" <${defaultSenderEmail}>`;
        }

        // Fire and forget async IIFE
        (async () => {
            try {
                const transporter = await this.getTransporter();
                
                if (!transporter) {
                    console.log(`[EmailService] Integration missing and SMTP host not found. Skipping email to ${payload.to}`);
                    return;
                }

                console.log(`[EmailService] Attempting to send email to: ${payload.to} via ${process.env.SMTP_HOST || "SMTP"}`);
                await transporter.sendMail({
                    from: fromHeader,
                    to: payload.to,
                    cc: payload.cc,
                    bcc: payload.bcc,
                    subject: payload.subject,
                    html: payload.html,
                    text: payload.text,
                    attachments: payload.attachments,
                    replyTo: settingsCacheService.get("NOTIFICATIONS_REPLY_TO_EMAIL", undefined),
                    priority:
                        payload.priority?.toLowerCase() as
                            | "high"
                            | "normal"
                            | "low"
                            | undefined,
                });
                console.log(`[EmailService] ✅ Successfully sent email to: ${payload.to}`);
            } catch (error: any) {
                console.error(`[EmailService] ❌ Failed to send email to ${payload.to}:`, error.message);
            }
        })();

        return {
            success: true,
            message: "Email queued for sending.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Send Bulk Email
    |--------------------------------------------------------------------------
    */
    async sendBulk(
        payload: ISendEmail[]
    ) {
        const result = [];

        for (const email of payload) {
            result.push(
                await this.send(email)
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
        email: string,
        otp: string
    ) {
        return this.send({
            to: email,
            subject: "OTP Verification",
            html: this.buildTemplate(
                EmailTemplate.OTP,
                {
                    otp,
                }
            ),
            template:
                EmailTemplate.OTP,
            priority:
                EmailPriority.HIGH,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Welcome Email
    |--------------------------------------------------------------------------
    */
    async sendWelcome(
        email: string
    ) {
        return this.send({
            to: email,
            subject: "Welcome to Exam SaaS",
            html: this.buildTemplate(
                EmailTemplate.WELCOME,
                {}
            ),
            template:
                EmailTemplate.WELCOME,
            priority:
                EmailPriority.NORMAL,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Password Reset
    |--------------------------------------------------------------------------
    */
    async sendPasswordReset(
        email: string,
        resetLink: string
    ) {
        return this.send({
            to: email,
            subject: "Password Reset",
            html: `
                <h2>Password Reset</h2>

                <p>
                    Click the link below to reset your password.
                </p>

                <a href="${resetLink}">
                    Reset Password
                </a>
            `,
            template:
                EmailTemplate.PASSWORD_RESET,
            priority:
                EmailPriority.HIGH,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Account Verification
    |--------------------------------------------------------------------------
    */
    async sendAccountVerification(
        email: string
    ) {
        return this.send({
            to: email,
            subject: "Account Verification",
            html: this.buildTemplate(
                EmailTemplate.ACCOUNT_VERIFICATION,
                {}
            ),
            template:
                EmailTemplate.ACCOUNT_VERIFICATION,
            priority:
                EmailPriority.HIGH,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Exam Schedule
    |--------------------------------------------------------------------------
    */
    async sendExamSchedule(
        payload: ISendEmail
    ) {
        return this.send({
            ...payload,
            template:
                EmailTemplate.EXAM_SCHEDULE,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Admit Card
    |--------------------------------------------------------------------------
    */
    async sendAdmitCard(
        payload: ISendEmail
    ) {
        return this.send({
            ...payload,
            template:
                EmailTemplate.ADMIT_CARD,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Result
    |--------------------------------------------------------------------------
    */
    async sendResult(
        payload: ISendEmail
    ) {
        return this.send({
            ...payload,
            template:
                EmailTemplate.RESULT,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Certificate
    |--------------------------------------------------------------------------
    */
    async sendCertificate(
        payload: ISendEmail
    ) {
        return this.send({
            ...payload,
            template:
                EmailTemplate.CERTIFICATE,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Send Custom Email
    |--------------------------------------------------------------------------
    */
    async sendCustom(
        payload: ISendEmail
    ) {
        return this.send(payload);
    }
}

export default new EmailService();
