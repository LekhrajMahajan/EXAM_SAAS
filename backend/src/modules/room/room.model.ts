import { Schema, model } from "mongoose";

import { IRoom, RoomStatus, RoomType } from "./room.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const RoomSchema = new Schema<IRoom>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    roomCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    roomName: {
      type: String,
      required: true,
      trim: true,
    },

    roomType: {
      type: String,
      enum: Object.values(RoomType),
      default: RoomType.COMPUTER_LAB,
      required: true,
      index: true,
    },

    building: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    rows: {
      type: Number,
      required: true,
      min: 1,
    },

    columns: {
      type: Number,
      required: true,
      min: 1,
    },

    cameraAvailable: {
      type: Boolean,
      default: false,
    },

    biometricDevice: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(RoomStatus),
      default: RoomStatus.ACTIVE,
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
| Virtual
|--------------------------------------------------------------------------
*/

RoomSchema.virtual("totalSeats").get(function () {
  return this.rows * this.columns;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Room code unique within a Center
RoomSchema.index(
  {
    companyId: 1,
    centerId: 1,
    roomCode: 1,
  },
  {
    unique: true,
  },
);

// Room name unique within a Center
RoomSchema.index(
  {
    companyId: 1,
    centerId: 1,
    roomName: 1,
  },
  {
    unique: true,
  },
);

// Search indexes
RoomSchema.index({
  companyId: 1,
  centerId: 1,
});

RoomSchema.index({
  companyId: 1,
  roomType: 1,
});

RoomSchema.index({
  companyId: 1,
  status: 1,
});

RoomSchema.index({
  companyId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Room = model<IRoom>("Room", RoomSchema);

export default Room;
