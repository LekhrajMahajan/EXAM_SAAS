/*
|--------------------------------------------------------------------------
| QR Type
|--------------------------------------------------------------------------
*/

export enum QrType {
  CERTIFICATE = "CERTIFICATE",

  ADMIT_CARD = "ADMIT_CARD",

  RESULT = "RESULT",

  EMPLOYEE = "EMPLOYEE",

  CANDIDATE = "CANDIDATE",

  PAPER = "PAPER",

  EXAM = "EXAM",

  REPORT = "REPORT",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| QR Image Format
|--------------------------------------------------------------------------
*/

export enum QrImageFormat {
  PNG = "png",

  SVG = "svg",

  JPEG = "jpeg",
}

/*
|--------------------------------------------------------------------------
| QR Error Correction
|--------------------------------------------------------------------------
*/

export enum QrErrorCorrection {
  LOW = "L",

  MEDIUM = "M",

  QUARTILE = "Q",

  HIGH = "H",
}

/*
|--------------------------------------------------------------------------
| Generate QR Payload
|--------------------------------------------------------------------------
*/

export interface IGenerateQr {
  type: QrType;

  text: string;

  fileName: string;

  width?: number;

  margin?: number;

  imageFormat?: QrImageFormat;

  errorCorrectionLevel?: QrErrorCorrection;

  metadata?: Record<string, unknown>;
}
