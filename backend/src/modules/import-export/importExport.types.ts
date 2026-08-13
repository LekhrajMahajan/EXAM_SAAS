/*
|--------------------------------------------------------------------------
| Import Export Type
|--------------------------------------------------------------------------
*/

export enum ImportExportType {
  CANDIDATE = "CANDIDATE",

  EMPLOYEE = "EMPLOYEE",

  COMPANY = "COMPANY",

  BRANCH = "BRANCH",

  CENTER = "CENTER",

  SUBJECT = "SUBJECT",

  CHAPTER = "CHAPTER",

  TOPIC = "TOPIC",

  QUESTION = "QUESTION",

  PAPER = "PAPER",

  EXAM = "EXAM",

  RESULT = "RESULT",

  ATTENDANCE = "ATTENDANCE",

  CERTIFICATE = "CERTIFICATE",
}

/*
|--------------------------------------------------------------------------
| File Format
|--------------------------------------------------------------------------
*/

export enum FileFormat {
  CSV = "CSV",

  XLSX = "XLSX",

  JSON = "JSON",

  PDF = "PDF",
}

/*
|--------------------------------------------------------------------------
| Import Status
|--------------------------------------------------------------------------
*/

export enum ImportStatus {
  PENDING = "PENDING",

  PROCESSING = "PROCESSING",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Export Status
|--------------------------------------------------------------------------
*/

export enum ExportStatus {
  PENDING = "PENDING",

  PROCESSING = "PROCESSING",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Import Request
|--------------------------------------------------------------------------
*/

export interface IImportRequest {
  type: ImportExportType;

  format: FileFormat;

  fileUrl: string;
}

/*
|--------------------------------------------------------------------------
| Export Request
|--------------------------------------------------------------------------
*/

export interface IExportRequest {
  type: ImportExportType;

  format: FileFormat;

  filters?: Record<string, unknown>;
}

/*
|--------------------------------------------------------------------------
| Import Result
|--------------------------------------------------------------------------
*/

export interface IImportResult {
  totalRecords: number;

  importedRecords: number;

  failedRecords: number;

  errors: string[];
}

/*
|--------------------------------------------------------------------------
| Export Result
|--------------------------------------------------------------------------
*/

export interface IExportResult {
  fileName: string;

  fileUrl: string;

  totalRecords: number;
}
