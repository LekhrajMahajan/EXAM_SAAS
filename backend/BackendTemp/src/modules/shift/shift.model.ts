import { Schema, model } from "mongoose";

import { IShift, ShiftStatus } from "./shift.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Shift Schema
|--------------------------------------------------------------------------
*/

const ShiftSchema = new Schema<IShift>(
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

    shiftName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    shiftCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    reportingTime: {
      type: String,
      required: true,
      trim: true,
    },

    gateClosingTime: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: Object.values(ShiftStatus),
      default: ShiftStatus.ACTIVE,
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
| Unique Shift Code Per Center
|--------------------------------------------------------------------------
*/

ShiftSchema.index(
  {
    centerId: 1,
    shiftCode: 1,
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

ShiftSchema.index({
  shiftCode: "text",
  shiftName: "text",
});

/*
|--------------------------------------------------------------------------
| Center Wise
|--------------------------------------------------------------------------
*/

ShiftSchema.index({
  centerId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

ShiftSchema.index({
  centerId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Shift = model<IShift>("Shift", ShiftSchema);

export default Shift;
