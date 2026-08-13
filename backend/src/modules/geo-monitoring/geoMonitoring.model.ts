import { Schema, model } from "mongoose";
import { GeoEntityType, IGeoMonitoring } from "./geoMonitoring.types";

const geoMonitoringSchema = new Schema<IGeoMonitoring>(
  {
    entityType: {
      type: String,
      enum: Object.values(GeoEntityType),
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    examId: {
      type: String,
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    outOfGeofence: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for getting latest location efficiently
geoMonitoringSchema.index({ examId: 1, entityId: 1, recordedAt: -1 });

export default model<IGeoMonitoring>("GeoMonitoring", geoMonitoringSchema);
