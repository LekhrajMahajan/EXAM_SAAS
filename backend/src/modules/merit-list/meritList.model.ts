import { Schema, model } from "mongoose";

import { IMeritList, MeritStatus } from "./meritList.types";

/*
|--------------------------------------------------------------------------
| Merit List Schema
|--------------------------------------------------------------------------
*/

const meritListSchema = new Schema<IMeritList>(
  {
    /*
            |--------------------------------------------------------------------------
            | References
            |--------------------------------------------------------------------------
            */

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      required: true,

      index: true,
    },

    resultId: {
      type: Schema.Types.ObjectId,

      ref: "Result",

      required: true,

      unique: true,

      index: true,
    },

    certificateId: {
      type: Schema.Types.ObjectId,

      ref: "Certificate",

      required: true,

      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidate",

      required: true,

      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Company",

      required: true,

      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",

      required: true,

      index: true,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,

      ref: "ExamCenter",

      required: true,

      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,

      ref: "Subject",

      required: true,

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Merit Ranking
            |--------------------------------------------------------------------------
            */

    meritNumber: {
      type: String,

      required: true,

      unique: true,

      trim: true,

      index: true,
    },

    rank: {
      type: Number,

      required: true,

      default: 0,

      index: true,
    },

    overallRank: {
      type: Number,

      default: 0,

      index: true,
    },

    stateRank: {
      type: Number,

      default: 0,

      index: true,
    },

    districtRank: {
      type: Number,

      default: 0,

      index: true,
    },

    centerRank: {
      type: Number,

      default: 0,

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Result Summary
            |--------------------------------------------------------------------------
            */

    marksObtained: {
      type: Number,

      required: true,

      min: 0,
    },

    percentage: {
      type: Number,

      required: true,

      min: 0,

      max: 100,
    },

    correctAnswers: {
      type: Number,

      default: 0,
    },

    wrongAnswers: {
      type: Number,

      default: 0,
    },

    negativeMarks: {
      type: Number,

      default: 0,
    },

    tieBreakerScore: {
      type: Number,

      default: 0,
    },

    /*
            |--------------------------------------------------------------------------
            | Classification
            |--------------------------------------------------------------------------
            */

    category: {
      type: String,

      required: true,

      trim: true,

      index: true,
    },

    gender: {
      type: String,

      required: true,

      trim: true,

      index: true,
    },

    meritStatus: {
      type: String,

      enum: Object.values(MeritStatus),

      default: MeritStatus.DRAFT,

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Publication
            |--------------------------------------------------------------------------
            */

    publishedAt: {
      type: Date,
    },

    publishedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    remarks: {
      type: String,

      trim: true,

      maxlength: 1000,

      default: "",
    },

    /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    isDeleted: {
      type: Boolean,

      default: false,

      index: true,
    },

    deletedAt: {
      type: Date,

      default: null,
    },
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

meritListSchema.index({
  examId: 1,

  rank: 1,
});

meritListSchema.index({
  subjectId: 1,

  rank: 1,
});

meritListSchema.index({
  companyId: 1,

  branchId: 1,
});

meritListSchema.index({
  examCenterId: 1,

  centerRank: 1,
});

meritListSchema.index({
  category: 1,

  rank: 1,
});

meritListSchema.index({
  gender: 1,

  rank: 1,
});

meritListSchema.index({
  meritStatus: 1,

  createdAt: -1,
});

meritListSchema.index({
  percentage: -1,

  marksObtained: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const MeritList = model<IMeritList>("MeritList", meritListSchema);

export default MeritList;
