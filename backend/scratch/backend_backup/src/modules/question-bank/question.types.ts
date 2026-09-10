import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Question Status
|--------------------------------------------------------------------------
*/

export enum QuestionStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  ARCHIVED = "ARCHIVED",
}

/*
|--------------------------------------------------------------------------
| Approval Status
|--------------------------------------------------------------------------
*/

export enum ApprovalStatus {
  DRAFT = "DRAFT",

  SUBMITTED = "SUBMITTED",

  REVIEWED = "REVIEWED",

  APPROVED = "APPROVED",

  REJECTED = "REJECTED",

  PUBLISHED = "PUBLISHED",
}

/*
|--------------------------------------------------------------------------
| Difficulty Level
|--------------------------------------------------------------------------
*/

export enum DifficultyLevel {
  EASY = "EASY",

  MEDIUM = "MEDIUM",

  HARD = "HARD",

  EXPERT = "EXPERT",
}

/*
|--------------------------------------------------------------------------
| Question Type
|--------------------------------------------------------------------------
*/

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",

  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",

  TRUE_FALSE = "TRUE_FALSE",

  NUMERICAL = "NUMERICAL",

  SUBJECTIVE = "SUBJECTIVE",

  CODING = "CODING",

  FILL_IN_THE_BLANK = "FILL_IN_THE_BLANK",

  MATCH_THE_FOLLOWING = "MATCH_THE_FOLLOWING",
}

/*
|--------------------------------------------------------------------------
| Language
|--------------------------------------------------------------------------
*/

export enum QuestionLanguage {
  ENGLISH = "ENGLISH",

  HINDI = "HINDI",

  GUJARATI = "GUJARATI",
}

/*
|--------------------------------------------------------------------------
| Question Option
|--------------------------------------------------------------------------
*/

export interface IQuestionOption {
  optionId: string;

  optionLabel: string;

  optionText: string;

  image?: string;

  isCorrect: boolean;
}

/*
|--------------------------------------------------------------------------
| Attachment
|--------------------------------------------------------------------------
*/

export interface IAttachment {
  type: "IMAGE" | "AUDIO" | "VIDEO" | "PDF";

  url: string;
}

/*
|--------------------------------------------------------------------------
| Question
|--------------------------------------------------------------------------
*/

export interface IQuestion {
  companyId: Types.ObjectId;

  subjectId: Types.ObjectId;

  chapterId: Types.ObjectId;

  topicId: Types.ObjectId;

  questionCode: string;

  language: QuestionLanguage;

  questionType: QuestionType;

  difficulty: DifficultyLevel;

  question: string;

  options: IQuestionOption[];

  correctAnswer: string[];

  marks: number;

  negativeMarks: number;

  explanation?: string;

  attachments: IAttachment[];

  tags: string[];

  approvalStatus: ApprovalStatus;

  version: number;

  usageCount: number;

  status: QuestionStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Question Document
|--------------------------------------------------------------------------
*/

export type QuestionDocument = HydratedDocument<IQuestion>;
