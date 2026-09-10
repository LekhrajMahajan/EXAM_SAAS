/*
|--------------------------------------------------------------------------
| PDF Type
|--------------------------------------------------------------------------
*/

export enum PdfType {
  CERTIFICATE = "CERTIFICATE",

  ADMIT_CARD = "ADMIT_CARD",

  RESULT = "RESULT",

  MERIT_LIST = "MERIT_LIST",

  QUESTION_PAPER = "QUESTION_PAPER",

  ANSWER_SHEET = "ANSWER_SHEET",

  REPORT = "REPORT",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| PDF Orientation
|--------------------------------------------------------------------------
*/

export enum PdfOrientation {
  PORTRAIT = "portrait",

  LANDSCAPE = "landscape",
}

/*
|--------------------------------------------------------------------------
| PDF Page Size
|--------------------------------------------------------------------------
*/

export enum PdfPageSize {
  A4 = "A4",

  A3 = "A3",

  LETTER = "LETTER",

  LEGAL = "LEGAL",
}

/*
|--------------------------------------------------------------------------
| Generate PDF Payload
|--------------------------------------------------------------------------
*/

export interface IGeneratePdf {
  type: PdfType;

  title: string;

  html: string;

  fileName: string;

  pageSize?: PdfPageSize;

  orientation?: PdfOrientation;

  metadata?: Record<string, unknown>;
}
