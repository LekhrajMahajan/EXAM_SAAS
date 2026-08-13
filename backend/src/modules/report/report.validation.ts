import { z } from "zod";

import { ReportFormat, ReportType, ReportVisibility } from "./report.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Report Filters
|--------------------------------------------------------------------------
*/

const reportFilterSchema = z.object({
  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  companyId: objectId.optional(),

  branchId: objectId.optional(),

  centerId: objectId.optional(),

  examId: objectId.optional(),

  candidateId: objectId.optional(),

  employeeId: objectId.optional(),

  status: z.string().optional(),
});

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

export const generateReportSchema = z.object({
  body: z.object({
    reportType: z.nativeEnum(ReportType),

    reportName: z.string().min(2).max(255),

    format: z.nativeEnum(ReportFormat),

    visibility: z.nativeEnum(ReportVisibility).optional(),

    filters: reportFilterSchema.optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Candidate Report
|--------------------------------------------------------------------------
*/

export const candidateReportSchema = z.object({
  body: z.object({
    candidateId: objectId,

    format: z.nativeEnum(ReportFormat),
  }),
});

/*
|--------------------------------------------------------------------------
| Exam Report
|--------------------------------------------------------------------------
*/

export const examReportSchema = z.object({
  body: z.object({
    examId: objectId,

    format: z.nativeEnum(ReportFormat),
  }),
});

/*
|--------------------------------------------------------------------------
| Result Report
|--------------------------------------------------------------------------
*/

export const resultReportSchema = z.object({
  body: z.object({
    examId: objectId,

    format: z.nativeEnum(ReportFormat),
  }),
});

/*
|--------------------------------------------------------------------------
| Attendance Report
|--------------------------------------------------------------------------
*/

export const attendanceReportSchema = z.object({
  body: z.object({
    examId: objectId,

    centerId: objectId.optional(),

    format: z.nativeEnum(ReportFormat),
  }),
});

/*
|--------------------------------------------------------------------------
| Biometric Report
|--------------------------------------------------------------------------
*/

export const biometricReportSchema = z.object({
  body: z.object({
    examId: objectId,

    format: z.nativeEnum(ReportFormat),
  }),
});

/*
|--------------------------------------------------------------------------
| Live Monitoring Report
|--------------------------------------------------------------------------
*/

export const liveMonitoringReportSchema = z.object({
  body: z.object({
    examId: objectId,

    format: z.nativeEnum(ReportFormat),
  }),
});

/*
|--------------------------------------------------------------------------
| Custom Report
|--------------------------------------------------------------------------
*/

export const customReportSchema = generateReportSchema;

/*
|--------------------------------------------------------------------------
| Report Id
|--------------------------------------------------------------------------
*/

export const reportIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardSchema = z.object({
  query: z.object({
    examId: objectId.optional(),
    companyId: objectId.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});
