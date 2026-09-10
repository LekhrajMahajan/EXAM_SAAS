import { Schema, model } from "mongoose";

import { IExamShift, ExamShiftStatus } from "./examShift.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Exam Shift Schema
|--------------------------------------------------------------------------
*/

const ExamShiftSchema = new Schema<IExamShift>(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    shiftCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    shiftName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    shiftNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    reportingTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    gateClosingTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalCandidates: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCenters: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(ExamShiftStatus),
      default: ExamShiftStatus.ACTIVE,
      index: true,
    },

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Unique Shift Code Per Exam
|--------------------------------------------------------------------------
*/

ExamShiftSchema.index(
  {
    examId: 1,
    shiftCode: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Unique Shift Number Per Exam
|--------------------------------------------------------------------------
*/

ExamShiftSchema.index(
  {
    examId: 1,
    shiftNumber: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

ExamShiftSchema.index({
  shiftCode: "text",
  shiftName: "text",
});

/*
|--------------------------------------------------------------------------
| Exam Wise
|--------------------------------------------------------------------------
*/

ExamShiftSchema.index({
  examId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Time Wise
|--------------------------------------------------------------------------
*/

ExamShiftSchema.index({
  startTime: 1,
  endTime: 1,
});

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

ExamShiftSchema.index({
  examId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const ExamShift = model<IExamShift>("ExamShift", ExamShiftSchema);

export default ExamShift;
