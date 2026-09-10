import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Topic Status
|--------------------------------------------------------------------------
*/

export enum TopicStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  ARCHIVED = "ARCHIVED",
}

/*
|--------------------------------------------------------------------------
| Topic Interface
|--------------------------------------------------------------------------
*/

export interface ITopic {
  companyId: Types.ObjectId;

  examId?: Types.ObjectId;

  subjectId: Types.ObjectId;
  subjectName?: string;

  chapterId: Types.ObjectId;

  topicCode: string;

  topicName: string;

  topicNumber: number;

  description?: string;

  estimatedQuestions: number;

  estimatedMarks: number;

  displayOrder: number;

  estimatedDuration?: number;

  difficultyLevel?: string;

  status: TopicStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Topic Document
|--------------------------------------------------------------------------
*/

export type TopicDocument = HydratedDocument<ITopic>;
