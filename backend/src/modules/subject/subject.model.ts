import { Schema, model } from "mongoose";

import { ISubject, SubjectStatus } from "./subject.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const SubjectSchema = new Schema<ISubject>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subjectShortName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    language: {
      type: String,
      trim: true,
      default: "ENGLISH",
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    color: {
      type: String,
      default: "#2563EB",
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
      default: 60,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
      default: 100,
    },

    passingMarks: {
      type: Number,
      required: true,
      min: 0,
      default: 40,
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

    questionCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(SubjectStatus),
      default: SubjectStatus.ACTIVE,
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
| Virtual
|--------------------------------------------------------------------------
*/

SubjectSchema.virtual("displayName").get(function () {
  return `${this.subjectCode} - ${this.subjectName}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Subject Code Unique Per Company
SubjectSchema.index(
  {
    companyId: 1,
    subjectCode: 1,
  },
  {
    unique: true,
  },
);

// Subject Name Unique Per Company
SubjectSchema.index(
  {
    companyId: 1,
    subjectName: 1,
  },
  {
    unique: true,
  },
);

// Short Name Unique Per Company
SubjectSchema.index(
  {
    companyId: 1,
    subjectShortName: 1,
  },
  {
    unique: true,
  },
);

// Search Index
SubjectSchema.index({
  companyId: 1,
  subjectName: "text",
  subjectCode: "text",
  description: "text",
});

// Status Index
SubjectSchema.index({
  companyId: 1,
  status: 1,
});

// Soft Delete Index
SubjectSchema.index({
  companyId: 1,
  isDeleted: 1,
});

// Sorting Index
SubjectSchema.index({
  companyId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Subject = model<ISubject>("Subject", SubjectSchema);

export default Subject;
