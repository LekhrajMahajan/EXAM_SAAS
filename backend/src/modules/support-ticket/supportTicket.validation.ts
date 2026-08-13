import { z } from "zod";
import { TicketPriority, TicketStatus, TicketCategory } from "./supportTicket.types";

const AttachmentSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().positive(),
});

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(5).max(255),
    description: z.string().min(10),
    category: z.nativeEnum(TicketCategory),
    priority: z.nativeEnum(TicketPriority).optional().default(TicketPriority.LOW),
    attachments: z.array(AttachmentSchema).optional().default([]),
    companyId: z.string().optional(),
  }),
});

export const updateTicketStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TicketStatus),
  }),
});

export const assignTicketSchema = z.object({
  body: z.object({
    assigneeId: z.string(),
  }),
});

export const addMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1),
    isInternalNote: z.boolean().optional().default(false),
    attachments: z.array(AttachmentSchema).optional().default([]),
  }),
});

export const getTicketsFilterSchema = z.object({
  query: z.object({
    companyId: z.string().optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    status: z.nativeEnum(TicketStatus).optional(),
    category: z.nativeEnum(TicketCategory).optional(),
    assignedTo: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
