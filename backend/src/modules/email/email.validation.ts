import { z } from "zod";

import { EmailPriority, EmailProvider, EmailTemplate } from "./email.types";

/*
|--------------------------------------------------------------------------
| Email
|--------------------------------------------------------------------------
*/

const email = z.string().email("Invalid email address");

/*
|--------------------------------------------------------------------------
| Attachment
|--------------------------------------------------------------------------
*/

const attachmentSchema = z.object({
  filename: z.string().min(1).max(255),

  path: z.string().min(1),

  contentType: z.string().optional(),
});

/*
|--------------------------------------------------------------------------
| Send Email
|--------------------------------------------------------------------------
*/

export const sendEmailSchema = z.object({
  body: z.object({
    to: z.union([email, z.array(email).min(1)]),

    cc: z.array(email).optional(),

    bcc: z.array(email).optional(),

    subject: z.string().min(1).max(255),

    html: z.string().min(1),

    text: z.string().optional(),

    template: z.nativeEnum(EmailTemplate).optional(),

    attachments: z.array(attachmentSchema).optional(),

    priority: z.nativeEnum(EmailPriority).optional(),

    provider: z.nativeEnum(EmailProvider).optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Bulk Email
|--------------------------------------------------------------------------
*/

export const sendBulkEmailSchema = z.object({
  body: z.object({
    recipients: z

      .array(email)

      .min(1),

    subject: z.string().min(1).max(255),

    html: z.string().min(1),

    text: z.string().optional(),

    attachments: z.array(attachmentSchema).optional(),

    priority: z.nativeEnum(EmailPriority).optional(),

    provider: z.nativeEnum(EmailProvider).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

export const sendOtpSchema = z.object({
  body: z.object({
    email,

    otp: z

      .string()

      .min(4)

      .max(10),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Admit Card
|--------------------------------------------------------------------------
*/

export const sendAdmitCardSchema = z.object({
  body: z.object({
    email,

    admitCardId: z

      .string()

      .regex(
        /^[0-9a-fA-F]{24}$/,

        "Invalid Admit Card Id",
      ),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Result
|--------------------------------------------------------------------------
*/

export const sendResultSchema = z.object({
  body: z.object({
    email,

    resultId: z

      .string()

      .regex(
        /^[0-9a-fA-F]{24}$/,

        "Invalid Result Id",
      ),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Certificate
|--------------------------------------------------------------------------
*/

export const sendCertificateSchema = z.object({
  body: z.object({
    email,

    certificateId: z

      .string()

      .regex(
        /^[0-9a-fA-F]{24}$/,

        "Invalid Certificate Id",
      ),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Custom Email
|--------------------------------------------------------------------------
*/

export const sendCustomEmailSchema = sendEmailSchema;
