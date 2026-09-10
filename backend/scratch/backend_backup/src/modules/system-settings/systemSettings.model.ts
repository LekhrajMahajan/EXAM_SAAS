import { Schema, model } from "mongoose";

import {
  SettingCategory,
  SettingType,
  SettingVisibility,
} from "./systemSettings.types";

const systemSettingsSchema = new Schema(
  {
    category: {
      type: String,

      enum: Object.values(SettingCategory),

      required: true,

      index: true,
    },

    key: {
      type: String,

      required: true,

      unique: true,

      trim: true,

      uppercase: true,

      index: true,
    },

    value: {
      type: Schema.Types.Mixed,

      required: true,
    },

    type: {
      type: String,

      enum: Object.values(SettingType),

      required: true,
    },

    visibility: {
      type: String,

      enum: Object.values(SettingVisibility),

      default: SettingVisibility.PRIVATE,
    },

    description: {
      type: String,

      trim: true,
    },

    isEditable: {
      type: Boolean,

      default: true,
    },

    isActive: {
      type: Boolean,

      default: true,

      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },
  },
  {
    timestamps: true,

    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

systemSettingsSchema.index({
  category: 1,

  isActive: 1,
});

const SystemSettings = model(
  "SystemSettings",

  systemSettingsSchema,
);

export default SystemSettings;
