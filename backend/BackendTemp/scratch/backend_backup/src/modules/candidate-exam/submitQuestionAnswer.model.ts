import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmitQuestionAnswer extends Document {
  candidateId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  paperId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  selectedOptionId?: mongoose.Types.ObjectId; // null if skipped
  isAnswered: boolean;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

const SubmitQuestionAnswerSchema = new Schema<ISubmitQuestionAnswer>(
  {
    candidateId: { type: Schema.Types.ObjectId, required: true, ref: 'Candidate' }, // Or ImportCandidate
    examId: { type: Schema.Types.ObjectId, required: true, ref: 'Exam' },
    paperId: { type: Schema.Types.ObjectId, required: true, ref: 'Paper' },
    questionId: { type: Schema.Types.ObjectId, required: true, ref: 'PaperQuestion' },
    selectedOptionId: { type: Schema.Types.ObjectId, default: null },
    isAnswered: { type: Boolean, default: false },
    isMarkedForReview: { type: Boolean, default: false },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'submitquestionanswer'
  }
);

// Compound index to ensure uniqueness for a candidate's answer per question in an exam
SubmitQuestionAnswerSchema.index({ candidateId: 1, examId: 1, questionId: 1 }, { unique: true });

export const SubmitQuestionAnswer = mongoose.models.submitquestionanswer || mongoose.model<ISubmitQuestionAnswer>('submitquestionanswer', SubmitQuestionAnswerSchema);
