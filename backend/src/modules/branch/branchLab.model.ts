import { Schema, model, Document } from "mongoose";

export interface IBranchLab extends Document {
  labId: string;
  labName: string;
  labCode: string;
  roomFloor: string;
  centerName: string;
  seatingCapacity: number;
  totalComputers: number;
  assignedSupervisor: string;
  facilities: string[];
  status: string;
  notes?: string;
  branchCode?: string;
  companyId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const branchLabSchema = new Schema<IBranchLab>(
  {
    labId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    labName: {
      type: String,
      required: true,
      trim: true,
    },
    labCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    roomFloor: {
      type: String,
      trim: true,
      default: "",
    },
    centerName: {
      type: String,
      trim: true,
      default: "",
    },
    seatingCapacity: {
      type: Number,
      default: 0,
    },
    totalComputers: {
      type: Number,
      default: 0,
    },
    assignedSupervisor: {
      type: String,
      trim: true,
      default: "Unassigned",
    },
    facilities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: "Exam Ready",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    branchCode: {
      type: String,
      trim: true,
      default: "",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BranchLab = model<IBranchLab>("BranchLab", branchLabSchema, "branchlabs");

export default BranchLab;
