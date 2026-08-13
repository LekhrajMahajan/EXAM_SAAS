import { z } from "zod";

import { PdfOrientation, PdfPageSize, PdfType } from "./pdf.types";

/*
|--------------------------------------------------------------------------
| Generate PDF
|--------------------------------------------------------------------------
*/

export const generatePdfSchema = z.object({
  body: z.object({
    type: z.nativeEnum(PdfType),

    title: z.string().min(1).max(255),

    html: z.string().min(1),

    fileName: z.string().min(1).max(255),

    pageSize: z.nativeEnum(PdfPageSize).optional(),

    orientation: z.nativeEnum(PdfOrientation).optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Certificate PDF
|--------------------------------------------------------------------------
*/

export const certificatePdfSchema = z.object({
  body: z.object({
    certificateId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Certificate Id"),
  }),
});

/*
|--------------------------------------------------------------------------
| Admit Card PDF
|--------------------------------------------------------------------------
*/

export const admitCardPdfSchema = z.object({
  body: z.object({
    admitCardId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Admit Card Id"),
  }),
});

/*
|--------------------------------------------------------------------------
| Result PDF
|--------------------------------------------------------------------------
*/

export const resultPdfSchema = z.object({
  body: z.object({
    resultId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Result Id"),
  }),
});

/*
|--------------------------------------------------------------------------
| Merit List PDF
|--------------------------------------------------------------------------
*/

export const meritListPdfSchema = z.object({
  body: z.object({
    meritListId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Merit List Id"),
  }),
});

/*
|--------------------------------------------------------------------------
| Question Paper PDF
|--------------------------------------------------------------------------
*/

export const questionPaperPdfSchema = z.object({
  body: z.object({
    paperId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Paper Id"),
  }),
});

/*
|--------------------------------------------------------------------------
| Report PDF
|--------------------------------------------------------------------------
*/

export const reportPdfSchema = z.object({
  body: z.object({
    reportId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Report Id"),
  }),
});
