import { z } from "zod";

import { AuditAction, AuditSeverity, AuditStatus } from "./auditLog.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Audit Log Id
|--------------------------------------------------------------------------
*/

export const auditLogIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreAuditLogSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteAuditLogSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| User Audit
|--------------------------------------------------------------------------
*/

export const userAuditSchema = z.object({
  params: z.object({
    userId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Module Audit
|--------------------------------------------------------------------------
*/

export const moduleAuditSchema = z.object({
  params: z.object({
    module: z.string().min(1).max(100),
  }),
});

/*
|--------------------------------------------------------------------------
| Audit Query
|--------------------------------------------------------------------------
*/

export const auditLogQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    employeeId: objectId.optional(),

    performedBy: objectId.optional(),

    action: z.nativeEnum(AuditAction).optional(),

    severity: z.nativeEnum(AuditSeverity).optional(),

    status: z.nativeEnum(AuditStatus).optional(),

    module: z.string().max(100).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statisticsSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examId: objectId.optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  }),
});
