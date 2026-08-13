import { Schema, model, Document, Types } from "mongoose";

export interface IAnalyticsPersonalization extends Document {
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  favoriteWidgets: string[];
  savedFilters: Array<{
    id: string;
    name: string;
    filter: Record<string, unknown>;
    isDefault: boolean;
  }>;
  customDashboard: Array<{
    widgetId: string;
    position: number;
    w: number;
    h: number;
    visible: boolean;
    colSpan?: number;
  }>;
  compactMode: boolean;
  defaultLandingPage: string;
  refreshInterval: number; // in seconds, e.g. 60
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsPersonalizationSchema = new Schema<IAnalyticsPersonalization>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    favoriteWidgets: [
      {
        type: String,
        trim: true,
      },
    ],
    savedFilters: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        filter: { type: Schema.Types.Mixed, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    customDashboard: [
      {
        widgetId: { type: String, required: true },
        position: { type: Number, default: 0 },
        w: { type: Number, default: 1 },
        h: { type: Number, default: 1 },
        visible: { type: Boolean, default: true },
        colSpan: { type: Number, default: 1 },
      },
    ],
    compactMode: {
      type: Boolean,
      default: false,
    },
    defaultLandingPage: {
      type: String,
      default: "executive",
      trim: true,
    },
    refreshInterval: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AnalyticsPersonalizationSchema.index({ userId: 1, companyId: 1 }, { unique: true });

export const AnalyticsPersonalization = model<IAnalyticsPersonalization>(
  "AnalyticsPersonalization",
  AnalyticsPersonalizationSchema
);
