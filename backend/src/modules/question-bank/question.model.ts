import { Schema, model } from "mongoose";

import {
  IQuestion,
  QuestionStatus,
  ApprovalStatus,
  DifficultyLevel,
  QuestionType,
  QuestionLanguage,
} from "./question.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const OptionSchema = new Schema(
  {
    optionId: {
      type: String,
      required: true,
      trim: true,
    },

    optionLabel: {
      type: String,
      required: true,
      trim: true,
    },

    optionText: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const AttachmentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["IMAGE", "AUDIO", "VIDEO", "PDF"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const QuestionSchema = new Schema<IQuestion>(
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

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      index: true,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      index: true,
    },

    questionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    language: {
      type: String,
      enum: Object.values(QuestionLanguage),
      default: QuestionLanguage.ENGLISH,
    },

    questionType: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
      index: true,
    },

    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [OptionSchema],
      default: [],
    },

    correctAnswer: {
      type: [String],
      default: [],
    },

    marks: {
      type: Number,
      default: 1,
      min: 0,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    explanation: {
      type: String,
      default: "",
    },

    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.DRAFT,
      index: true,
    },

    version: {
      type: Number,
      default: 1,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.ACTIVE,
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

QuestionSchema.index(
  {
    companyId: 1,
    questionCode: 1,
  }
);

QuestionSchema.index({
  companyId: 1,
  subjectId: 1,
  chapterId: 1,
  topicId: 1,
});

QuestionSchema.index({
  companyId: 1,
  difficulty: 1,
  questionType: 1,
});

QuestionSchema.index({
  companyId: 1,
  approvalStatus: 1,
});

QuestionSchema.index({
  companyId: 1,
  status: 1,
});

QuestionSchema.index({
  companyId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Full Text Search
|--------------------------------------------------------------------------
*/

QuestionSchema.index({
  question: "text",
  explanation: "text",
  tags: "text",
});

const Question = model<IQuestion>("Question", QuestionSchema);

export default Question;
