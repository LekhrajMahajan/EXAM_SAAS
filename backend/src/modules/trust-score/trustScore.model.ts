import { Schema, model } from "mongoose";
import { EntityTrustType, FraudRating, ITrustScore } from "./trustScore.types";

const trustScoreSchema = new Schema<ITrustScore>(
  {
    entityType: {
      type: String,
      enum: Object.values(EntityTrustType),
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
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    violationBreakdown: {
      tabSwitches: { type: Number, default: 0 },
      fullscreenExits: { type: Number, default: 0 },
      copyPastes: { type: Number, default: 0 },
      devToolsOpens: { type: Number, default: 0 },
      networkDisconnects: { type: Number, default: 0 },
      faceMismatches: { type: Number, default: 0 },
      spoofDetections: { type: Number, default: 0 },
    },
    fraudRating: {
      type: String,
      enum: Object.values(FraudRating),
      required: true,
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for getting latest score
trustScoreSchema.index({ examId: 1, entityId: 1, calculatedAt: -1 });

export default model<ITrustScore>("TrustScore", trustScoreSchema);
