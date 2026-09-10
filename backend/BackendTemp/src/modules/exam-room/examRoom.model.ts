import { Schema, model } from "mongoose";

import { IExamRoom, ExamRoomStatus } from "./examRoom.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Exam Room Schema
|--------------------------------------------------------------------------
*/

const ExamRoomSchema = new Schema<IExamRoom>(
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
      ref: "ExamCenter",
      required: true,
      index: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },

    floorNumber: {
      type: Number,
      default: 0,
    },

    buildingName: {
      type: String,
      trim: true,
      default: "",
    },

    roomCapacity: {
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

    status: {
      type: String,
      enum: Object.values(ExamRoomStatus),
      default: ExamRoomStatus.ACTIVE,
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
| One Room Per Exam Center
|--------------------------------------------------------------------------
*/

ExamRoomSchema.index(
  {
    centerId: 1,
    roomId: 1,
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





/*
|--------------------------------------------------------------------------
| Capacity
|--------------------------------------------------------------------------
*/

ExamRoomSchema.index({
  roomCapacity: 1,
  availableSeats: 1,
});

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

ExamRoomSchema.index({
  status: 1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

ExamRoomSchema.index({
  centerId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const ExamRoom = model<IExamRoom>("ExamRoom", ExamRoomSchema);

export default ExamRoom;
