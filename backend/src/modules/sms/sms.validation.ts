import { z } from "zod";

import { SmsPriority, SmsProvider, SmsTemplate } from "./sms.types";

/*
|--------------------------------------------------------------------------
| Phone Number
|--------------------------------------------------------------------------
*/

const phone = z.string().regex(/^[1-9]\d{9,14}$/, "Invalid phone number.");

/*
|--------------------------------------------------------------------------
| Send SMS
|--------------------------------------------------------------------------
*/

export const sendSmsSchema = z.object({
  body: z.object({
    phone: z.union([phone, z.array(phone).min(1)]),

    message: z.string().min(1).max(1000),

    template: z.nativeEnum(SmsTemplate).optional(),

    provider: z.nativeEnum(SmsProvider).optional(),

    priority: z.nativeEnum(SmsPriority).optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Bulk SMS
|--------------------------------------------------------------------------
*/

export const sendBulkSmsSchema = z.object({
  body: z.object({
    phones: z.array(phone).min(1),

    message: z.string().min(1).max(1000),

    template: z.nativeEnum(SmsTemplate).optional(),

    provider: z.nativeEnum(SmsProvider).optional(),

    priority: z.nativeEnum(SmsPriority).optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Send OTP SMS
|--------------------------------------------------------------------------
*/

export const sendOtpSmsSchema = z.object({
  body: z.object({
    phone,

    otp: z.string().min(4).max(10),

    expiry: z.number().positive().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Admit Card SMS
|--------------------------------------------------------------------------
*/

export const sendAdmitCardSmsSchema = z.object({
  body: z.object({
    phone,

    admitCardId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Admit Card Id."),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Result SMS
|--------------------------------------------------------------------------
*/

export const sendResultSmsSchema = z.object({
  body: z.object({
    phone,

    resultId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Result Id."),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Certificate SMS
|--------------------------------------------------------------------------
*/

export const sendCertificateSmsSchema = z.object({
  body: z.object({
    phone,

    certificateId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Certificate Id."),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Custom SMS
|--------------------------------------------------------------------------
*/

export const sendCustomSmsSchema = sendSmsSchema;
