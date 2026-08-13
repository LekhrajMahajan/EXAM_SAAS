import { z } from "zod";

import { CertificateStatus, CertificateType } from "./certificate.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Certificate
|--------------------------------------------------------------------------
*/

export const createCertificateSchema = z.object({
  body: z.object({
    resultId: objectId,

    approvalId: objectId.optional(),

    candidateId: objectId,

    candidateAssignmentId: objectId.optional(),

    attendanceId: objectId.optional(),

    submissionId: objectId.optional(),

    examId: objectId,

    paperId: objectId.optional(),

    subjectId: objectId.optional(),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examCenterId: objectId.optional(),

    certificateType: z.nativeEnum(CertificateType).optional(),

    expiryDate: z.coerce.date().optional(),

    remarks: z.string().max(1000).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Certificate Id
|--------------------------------------------------------------------------
*/

export const certificateIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

export const generateCertificateSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Issue Certificate
|--------------------------------------------------------------------------
*/

export const issueCertificateSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Revoke Certificate
|--------------------------------------------------------------------------
*/

export const revokeCertificateSchema = z.object({
  body: z.object({
    certificateId: objectId,
    reason: z.string().min(5).max(1000).optional(),
    remarks: z.string().min(5).max(1000).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreCertificateSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteCertificateSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

export const verifyCertificateSchema = z.object({
  params: z.object({
    verificationCode: z
      .string()

      .min(6)

      .max(100),
  }),
});

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

export const downloadCertificateSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Certificate Query
|--------------------------------------------------------------------------
*/

export const certificateQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examCenterId: objectId.optional(),

    certificateStatus: z.nativeEnum(CertificateStatus).optional(),

    certificateType: z.nativeEnum(CertificateType).optional(),
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
  }),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statisticsSchema = z.object({
  query: z.object({
    examId: objectId.optional(),

    companyId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Result Certificate
|--------------------------------------------------------------------------
*/

export const resultCertificateSchema = z.object({
  params: z.object({
    resultId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Candidate Certificate
|--------------------------------------------------------------------------
*/

export const candidateCertificateSchema = z.object({
  params: z.object({
    candidateId: objectId,
  }),
});
