import { Schema, model } from "mongoose";

import { IExamCenter, ExamCenterStatus } from "./examCenter.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Exam Center Schema
|--------------------------------------------------------------------------
*/

const ExamCenterSchema = new Schema<IExamCenter>(
  {
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

    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    centerCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    allocatedCandidates: {
      type: Number,
      default: 0,
      min: 0,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    reportingTime: {
      type: Date,
      required: true,
    },

    gateClosingTime: {
      type: Date,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ExamCenterStatus),
      default: ExamCenterStatus.ACTIVE,
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
| One Center Per Shift
|--------------------------------------------------------------------------
*/

ExamCenterSchema.index(
  {
    shiftId: 1,
    centerId: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Exam Wise
|--------------------------------------------------------------------------
*/

ExamCenterSchema.index({
  examId: 1,
  shiftId: 1,
});

/*
|--------------------------------------------------------------------------
| Center Wise
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Capacity
|--------------------------------------------------------------------------
*/

ExamCenterSchema.index({
  availableSeats: 1,
  allocatedCandidates: 1,
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

ExamCenterSchema.index({
  shiftId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const ExamCenter = model<IExamCenter>("ExamCenter", ExamCenterSchema);

export default ExamCenter;
