import { HydratedDocument, Types } from "mongoose";

export enum QuestionStatus {
  NOT_VISITED = "NOT_VISITED",
  NOT_ANSWERED = "NOT_ANSWERED",
  ANSWERED = "ANSWERED",
  MARKED_FOR_REVIEW = "MARKED_FOR_REVIEW",
  ANSWERED_AND_MARKED = "ANSWERED_AND_MARKED",
}

export interface ICandidateAnswer {
  submissionId: Types.ObjectId;

  candidateId: Types.ObjectId;

  examId: Types.ObjectId;

  paperId: Types.ObjectId;

  questionId: Types.ObjectId;

  sectionId?: Types.ObjectId;

  questionNumber: number;

  questionType: string;

  selectedOption?: string;

  selectedOptions?: string[];

  numericalAnswer?: number;

  subjectiveAnswer?: string;

  uploadedFile?: string;

  isAnswered: boolean;

  isMarkedForReview: boolean;

  questionStatus: QuestionStatus;

  timeSpent: number;

  answerVersion: number;

  lastSavedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export type CandidateAnswerDocument = HydratedDocument<ICandidateAnswer>;
