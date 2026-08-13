import { Schema, model } from "mongoose";

import { IAdmitCard, AdmitCardStatus } from "./admitCard.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Admit Card Schema
|--------------------------------------------------------------------------
*/

const AdmitCardSchema = new Schema<IAdmitCard>(
  {
    /*
            |--------------------------------------------------------------------------
            | References
            |--------------------------------------------------------------------------
            */

    candidateAssignmentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "ExamShift",
      required: true,
      index: true,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      required: true,
      index: true,
    },

    examRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ExamRoom",
      required: true,
      index: true,
    },

    seatAllocationId: {
      type: Schema.Types.ObjectId,
      ref: "SeatAllocation",
      required: true,
      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Admit Card
            |--------------------------------------------------------------------------
            */

    admitCardNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    qrCode: {
      type: String,
      required: true,
      trim: true,
    },

    barcode: {
      type: String,
      required: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Tracking
            |--------------------------------------------------------------------------
            */

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    printCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastDownloadedAt: {
      type: Date,
      default: null,
    },

    lastPrintedAt: {
      type: Date,
      default: null,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

    status: {
      type: String,
      enum: Object.values(AdmitCardStatus),
      default: AdmitCardStatus.GENERATED,
      index: true,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    /*
            |--------------------------------------------------------------------------
            | Base Schema
            |--------------------------------------------------------------------------
            */

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Unique Constraints
|--------------------------------------------------------------------------
*/

// One Candidate Assignment -> One Admit Card



// Unique Admit Card Number



/*
|--------------------------------------------------------------------------
| Candidate Search
|--------------------------------------------------------------------------
*/













/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

AdmitCardSchema.index({
  examId: 1,
  status: 1,
});

AdmitCardSchema.index({
  examCenterId: 1,
  status: 1,
});

AdmitCardSchema.index({
  examRoomId: 1,
  status: 1,
});

/*
|--------------------------------------------------------------------------
| Download Tracking
|--------------------------------------------------------------------------
*/

AdmitCardSchema.index({
  downloadCount: -1,
});

AdmitCardSchema.index({
  lastDownloadedAt: -1,
});

/*
|--------------------------------------------------------------------------
| Print Tracking
|--------------------------------------------------------------------------
*/

AdmitCardSchema.index({
  printCount: -1,
});

AdmitCardSchema.index({
  lastPrintedAt: -1,
});

/*
|--------------------------------------------------------------------------
| Verification
|--------------------------------------------------------------------------
*/

AdmitCardSchema.index({
  qrCode: 1,
});

AdmitCardSchema.index({
  barcode: 1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const AdmitCard = model<IAdmitCard>("AdmitCard", AdmitCardSchema);

export default AdmitCard;
