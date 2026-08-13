import { Schema, model, models } from "mongoose";
import { IOrganizationInitialization } from "./organizationSeeder.types";

const SeederStepLogSchema = new Schema(
  {
    stepName: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    createdResources: { type: Number, default: 0 },
    executionTimeMs: { type: Number, default: 0 },
    status: { type: String, enum: ["SUCCESS", "FAILED", "ROLLEDBACK"], default: "SUCCESS" },
    errorMessage: { type: String, default: "" },
  },
  { _id: false }
);

const OrganizationInitializationSchema = new Schema<IOrganizationInitialization>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "RESEEDED"],
      default: "PENDING",
      index: true,
    },
    planCode: {
      type: String,
      enum: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
      default: "STARTER",
    },
    stepLogs: [SeederStepLogSchema],
    createdRoles: [{ type: String }],
    createdBranches: [{ type: String }],
    createdCenters: [{ type: String }],
    defaultDepartments: [{ type: String }],
    defaultDesignations: [{ type: String }],
    dashboardWidgets: [{ type: Schema.Types.Mixed }],
    storageFolders: [{ type: String }],
    securityPolicies: {
      passwordPolicy: {
        minLength: { type: Number, default: 8 },
        requireNumbers: { type: Boolean, default: true },
        requireSpecialChars: { type: Boolean, default: true },
        requireUppercase: { type: Boolean, default: true },
      },
      sessionTimeoutMinutes: { type: Number, default: 30 },
      mfaPolicy: { type: String, default: "OPTIONAL" },
      ipPolicy: { type: String, default: "OPEN" },
      browserPolicy: { type: String, default: "STANDARD" },
      deviceTrust: { type: String, default: "ANY" },
      auditPolicy: { type: String, default: "STANDARD" },
    },
    initializedAt: { type: Date, default: Date.now },
    reseededAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const OrganizationInitialization =
  models.OrganizationInitialization ||
  model<IOrganizationInitialization>("OrganizationInitialization", OrganizationInitializationSchema);
