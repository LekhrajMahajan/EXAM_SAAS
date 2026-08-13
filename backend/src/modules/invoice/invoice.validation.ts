import { z } from "zod";
import { InvoiceStatus, PaymentStatus, InvoiceType } from "./invoice.types";
import { Types } from "mongoose";

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId format",
});

export const queryInvoiceSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    search: z.string().optional(),
    status: z.nativeEnum(InvoiceStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    companyId: objectIdSchema.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    type: z.nativeEnum(InvoiceType).optional(),
  }),
});

export const updateInvoiceStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(InvoiceStatus),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    notes: z.string().optional(),
  }),
});

export const createNoteSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    reason: z.string().min(5),
    remarks: z.string().optional(),
    effectiveDate: z.string().datetime(),
  }),
});

export const emailInvoiceSchema = z.object({
  body: z.object({
    to: z.string().email(),
    cc: z.string().optional(),
    message: z.string().optional(),
  }),
});
