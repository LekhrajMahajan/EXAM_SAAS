import { Schema, model } from "mongoose";

import { IPaper, PaperApprovalStatus, PaperStatus } from "./paper.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Paper Section Schema
|--------------------------------------------------------------------------
*/

const PaperSectionSchema = new Schema(
  {
    sectionCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    sectionName: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    optionalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

/*
|--------------------------------------------------------------------------
| Paper Schema
|--------------------------------------------------------------------------
*/

const PaperSchema = new Schema<IPaper>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      index: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },

    paperCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    paperName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    passingMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    negativeMarking: {
      type: Boolean,
      default: false,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    shuffleQuestions: {
      type: Boolean,
      default: false,
    },

    shuffleOptions: {
      type: Boolean,
      default: false,
    },

    instructions: {
      type: [String],
      default: [],
    },

    sections: {
      type: [PaperSectionSchema],
      default: [],
    },

    approvalStatus: {
      type: String,
      enum: Object.values(PaperApprovalStatus),
      default: PaperApprovalStatus.DRAFT,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PaperStatus),
      default: PaperStatus.ACTIVE,
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
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Company + Paper Code
PaperSchema.index(
  {
    companyId: 1,
    paperCode: 1,
  },
  {
    unique: true,
  },
);

// Company + Subject + Paper Name
PaperSchema.index(
  {
    companyId: 1,
    subjectId: 1,
    paperName: 1,
  },
  {
    unique: true,
  },
);

// Search Index
PaperSchema.index({
  companyId: 1,
  paperCode: "text",
  paperName: "text",
  description: "text",
});

// Status
PaperSchema.index({
  companyId: 1,
  status: 1,
});

// Approval Status
PaperSchema.index({
  companyId: 1,
  approvalStatus: 1,
});

// Soft Delete
PaperSchema.index({
  companyId: 1,
  isDeleted: 1,
});

// Subject Wise Listing
PaperSchema.index({
  subjectId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Paper = model<IPaper>("Paper", PaperSchema);

export default Paper;
