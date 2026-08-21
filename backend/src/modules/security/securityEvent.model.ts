import { Schema, model } from "mongoose";
import { ISecurityEvent, EventSeverity, EventStatus } from "./securityEvent.types";

const securityEventSchema = new Schema<ISecurityEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    severity: {
      type: String,
      enum: Object.values(EventSeverity),
      required: true,
      index: true,
    },

    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    employeeId: { type: String, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },

    ipAddress: { type: String, index: true },
    device: { type: String },
    browser: { type: String },
    operatingSystem: { type: String },
    location: { type: String },

    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.OPEN,
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },

    metadata: { type: Schema.Types.Mixed, default: {} },
    recommendedAction: { type: String },
    relatedEvents: [{ type: Schema.Types.ObjectId, ref: "SecurityEvent" }],
  },
  {
    timestamps: true,
  }
);

// Pre-save to generate an eventId if one wasn't provided
securityEventSchema.pre("validate", function (next: any) {
  if (!this.eventId) {
    this.eventId = `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  if (typeof next === "function") next();
});

export const SecurityEventModel = model<ISecurityEvent>(
  "SecurityEvent",
  securityEventSchema
);
