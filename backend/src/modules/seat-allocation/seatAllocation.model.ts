import { Schema, model } from "mongoose";

import { ISeatAllocation, SeatAllocationStatus } from "./seatAllocation.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Seat Allocation Schema
|--------------------------------------------------------------------------
*/

const SeatAllocationSchema = new Schema<ISeatAllocation>(
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

    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
      index: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    rowNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    columnNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },

    allocationStatus: {
      type: String,
      enum: Object.values(SeatAllocationStatus),
      default: SeatAllocationStatus.AVAILABLE,
      index: true,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
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
| Unique Seat Per Exam Room
|--------------------------------------------------------------------------
*/

SeatAllocationSchema.index(
  {
    examRoomId: 1,
    seatId: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| One Candidate One Seat Per Shift
|--------------------------------------------------------------------------
*/

SeatAllocationSchema.index(
  {
    shiftId: 1,
    candidateId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      candidateId: { $exists: true },
      isDeleted: false,
    },
  },
);

/*
|--------------------------------------------------------------------------
| Exam Hierarchy
|--------------------------------------------------------------------------
*/

SeatAllocationSchema.index({
  examId: 1,
  shiftId: 1,
  examCenterId: 1,
  examRoomId: 1,
});

/*
|--------------------------------------------------------------------------
| Seat Search
|--------------------------------------------------------------------------
*/

SeatAllocationSchema.index({
  seatNumber: 1,
});

SeatAllocationSchema.index({
  rowNumber: 1,
  columnNumber: 1,
});

/*
|--------------------------------------------------------------------------
| Candidate Lookup
|--------------------------------------------------------------------------
*/

SeatAllocationSchema.index({
  candidateId: 1,
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

SeatAllocationSchema.index({
  examRoomId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const SeatAllocation = model<ISeatAllocation>(
  "SeatAllocation",
  SeatAllocationSchema,
);

export default SeatAllocation;
