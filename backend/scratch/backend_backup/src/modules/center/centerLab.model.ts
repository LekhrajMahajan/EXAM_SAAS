import { Schema, model, Document } from "mongoose";

export interface ICenterLab extends Document {
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
  centerCode?: string;
  companyId?: Schema.Types.ObjectId;
  centerId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const centerLabSchema = new Schema<ICenterLab>(
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
    centerCode: {
      type: String,
      trim: true,
      default: "",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CenterLab = model<ICenterLab>("CenterLab", centerLabSchema, "centerlab");

export default CenterLab;
