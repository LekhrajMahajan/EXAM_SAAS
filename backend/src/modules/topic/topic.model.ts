import { Schema, model } from "mongoose";

import { ITopic, TopicStatus } from "./topic.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const TopicSchema = new Schema<ITopic>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      index: true,
      required: false,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },

    topicCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    topicName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    topicNumber: {
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

    estimatedDuration: {
      type: Number,
      min: 0,
    },

    difficultyLevel: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(TopicStatus),
      default: TopicStatus.ACTIVE,
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

TopicSchema.virtual("displayName").get(function () {
  return `${this.topicCode} - ${this.topicName}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Company + Exam + Subject + Chapter + Topic Code
TopicSchema.index(
  {
    companyId: 1,
    examId: 1,
    subjectId: 1,
    chapterId: 1,
    topicCode: 1,
  },
  {
    unique: true,
  },
);

// Company + Exam + Subject + Chapter + Topic Name
TopicSchema.index(
  {
    companyId: 1,
    examId: 1,
    subjectId: 1,
    chapterId: 1,
    topicName: 1,
  },
  {
    unique: true,
  },
);

// Company + Exam + Subject + Chapter + Topic Number
TopicSchema.index(
  {
    companyId: 1,
    examId: 1,
    subjectId: 1,
    chapterId: 1,
    topicNumber: 1,
  },
  {
    unique: true,
  },
);

// Search Index
TopicSchema.index({
  companyId: 1,
  topicCode: "text",
  topicName: "text",
  description: "text",
});

// Status Index
TopicSchema.index({
  companyId: 1,
  status: 1,
});

// Soft Delete
TopicSchema.index({
  companyId: 1,
  isDeleted: 1,
});

// Display Order
TopicSchema.index({
  chapterId: 1,
  displayOrder: 1,
});

// Topic Listing
TopicSchema.index({
  chapterId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Topic = model<ITopic>("Topic", TopicSchema);

// Sync indexes to automatically drop old unique indexes that lacked examId
Topic.syncIndexes().catch(console.error);

export default Topic;
