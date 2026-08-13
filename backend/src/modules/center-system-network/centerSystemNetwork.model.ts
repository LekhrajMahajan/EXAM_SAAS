import mongoose, { Document, Schema } from "mongoose";

export interface ICenterSystemNetwork extends Document {
  ipAddress: string;
  status: "ONLINE" | "OFFLINE";
  latency: number | null;
  openPorts: number[];
  center?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const centerSystemNetworkSchema = new Schema<ICenterSystemNetwork>(
  {
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "OFFLINE",
    },
    latency: {
      type: Number,
      default: null,
    },
    openPorts: {
      type: [Number],
      default: [],
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: "Center",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CenterSystemNetwork = mongoose.model<ICenterSystemNetwork>(
  "CenterSystemNetwork",
  centerSystemNetworkSchema
);

export default CenterSystemNetwork;
