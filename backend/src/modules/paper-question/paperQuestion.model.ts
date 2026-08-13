import { Schema, model } from "mongoose";

import { IPaperQuestion, PaperQuestionStatus } from "./paperQuestion.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Paper Question Schema
|--------------------------------------------------------------------------
*/

const PaperQuestionSchema = new Schema<IPaperQuestion>(
  {
    paperId: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
      index: true,
    },

    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    sectionCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    questionOrder: {
      type: Number,
      required: true,
      min: 1,
    },

    displayOrder: {
      type: Number,
      required: true,
      min: 1,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    isCompulsory: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: Object.values(PaperQuestionStatus),
      default: PaperQuestionStatus.ACTIVE,
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
| Unique Question Per Paper
|--------------------------------------------------------------------------
*/

PaperQuestionSchema.index(
  {
    paperId: 1,
    questionId: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Section Wise Ordering
|--------------------------------------------------------------------------
*/

PaperQuestionSchema.index({
  paperId: 1,
  sectionCode: 1,
  questionOrder: 1,
});

/*
|--------------------------------------------------------------------------
| Display Order
|--------------------------------------------------------------------------
*/

PaperQuestionSchema.index({
  paperId: 1,
  displayOrder: 1,
});

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

PaperQuestionSchema.index({
  paperId: 1,
  status: 1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

PaperQuestionSchema.index({
  paperId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const PaperQuestion = model<IPaperQuestion>(
  "PaperQuestion",
  PaperQuestionSchema,
);

export default PaperQuestion;
