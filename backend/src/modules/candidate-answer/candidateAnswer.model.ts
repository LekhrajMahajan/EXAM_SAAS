import { Schema, model } from "mongoose";

import { ICandidateAnswer, QuestionStatus } from "./candidateAnswer.types";

const candidateAnswerSchema = new Schema<ICandidateAnswer>(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "ExamSubmission",
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

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

    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSection",
    },

    questionNumber: {
      type: Number,
      required: true,
    },

    questionType: {
      type: String,
      required: true,
      trim: true,
    },

    selectedOption: {
      type: String,
      default: null,
    },

    selectedOptions: {
      type: [String],
      default: [],
    },

    numericalAnswer: {
      type: Number,
      default: null,
    },

    subjectiveAnswer: {
      type: String,
      default: null,
      trim: true,
    },

    uploadedFile: {
      type: String,
      default: null,
      trim: true,
    },

    isAnswered: {
      type: Boolean,
      default: false,
      index: true,
    },

    isMarkedForReview: {
      type: Boolean,
      default: false,
    },

    questionStatus: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.NOT_VISITED,
      index: true,
    },

    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    answerVersion: {
      type: Number,
      default: 1,
    },

    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "candidateexamanswer",
  },
);

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

candidateAnswerSchema.index(
  {
    submissionId: 1,
    questionId: 1,
  },
  {
    unique: true,
  },
);

candidateAnswerSchema.index({
  candidateId: 1,
  examId: 1,
});

candidateAnswerSchema.index({
  paperId: 1,
  questionNumber: 1,
});



const CandidateAnswer = model<ICandidateAnswer>(
  "CandidateAnswer",
  candidateAnswerSchema,
);

export default CandidateAnswer;
