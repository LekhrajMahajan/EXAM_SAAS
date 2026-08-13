import { Schema, model } from "mongoose";

import { IChapter, ChapterStatus } from "./chapter.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const ChapterSchema = new Schema<IChapter>(
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
      required: true,
      index: true,
    },

    chapterCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    chapterName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    chapterNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    estimatedQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    estimatedMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(ChapterStatus),
      default: ChapterStatus.ACTIVE,
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

ChapterSchema.virtual("displayName").get(function () {
  return `${this.chapterCode} - ${this.chapterName}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Company + Subject + Chapter Code
ChapterSchema.index(
  {
    companyId: 1,
    subjectId: 1,
    chapterCode: 1,
  },
  {
    unique: true,
  },
);

// Company + Subject + Chapter Name
ChapterSchema.index(
  {
    companyId: 1,
    subjectId: 1,
    chapterName: 1,
  },
  {
    unique: true,
  },
);

// Company + Subject + Chapter Number
ChapterSchema.index(
  {
    companyId: 1,
    subjectId: 1,
    chapterNumber: 1,
  },
  {
    unique: true,
  },
);

// Search Index
ChapterSchema.index({
  companyId: 1,
  chapterName: "text",
  chapterCode: "text",
  description: "text",
});

// Status Index
ChapterSchema.index({
  companyId: 1,
  status: 1,
});

// Soft Delete Index
ChapterSchema.index({
  companyId: 1,
  isDeleted: 1,
});

// Display Order
ChapterSchema.index({
  subjectId: 1,
  displayOrder: 1,
});

// Subject Wise
ChapterSchema.index({
  subjectId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Chapter = model<IChapter>("Chapter", ChapterSchema);

export default Chapter;
