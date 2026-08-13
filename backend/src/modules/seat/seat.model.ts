import { Schema, model } from "mongoose";

import { ISeat, SeatStatus, SeatType } from "./seat.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const SeatSchema = new Schema<ISeat>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },





    seatNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    row: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    column: {
      type: Number,
      required: true,
      min: 1,
    },

    seatType: {
      type: String,
      enum: Object.values(SeatType),
      default: SeatType.NORMAL,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(SeatStatus),
      default: SeatStatus.AVAILABLE,
      required: true,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    remarks: {
      type: String,
      default: "",
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
| Virtual
|--------------------------------------------------------------------------
*/

SeatSchema.virtual("seatLabel").get(function () {
  return `${this.row}-${String(this.column).padStart(2, "0")}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Seat Number must be unique inside a room
SeatSchema.index(
  {
    roomId: 1,
    seatNumber: 1,
  },
  {
    unique: true,
  },
);

// Row + Column must be unique inside a room
SeatSchema.index(
  {
    roomId: 1,
    row: 1,
    column: 1,
  },
  {
    unique: true,
  },
);



// Fast lookup
SeatSchema.index({
  companyId: 1,
  branchId: 1,
  centerId: 1,
  roomId: 1,
});

SeatSchema.index({
  roomId: 1,
  status: 1,
});

SeatSchema.index({
  roomId: 1,
  seatType: 1,
});

SeatSchema.index({
  roomId: 1,
  isBlocked: 1,
});

SeatSchema.index({
  companyId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Seat = model<ISeat>("Seat", SeatSchema);

export default Seat;
