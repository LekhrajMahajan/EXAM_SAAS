import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Chapter Status
|--------------------------------------------------------------------------
*/

export enum ChapterStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  ARCHIVED = "ARCHIVED",
}

/*
|--------------------------------------------------------------------------
| Chapter Interface
|--------------------------------------------------------------------------
*/

export interface IChapter {
  companyId: Types.ObjectId;

  subjectId: Types.ObjectId;

  chapterCode: string;

  chapterName: string;

  chapterNumber: number;

  description?: string;

  estimatedQuestions: number;

  estimatedMarks: number;

  displayOrder: number;

  status: ChapterStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Chapter Document
|--------------------------------------------------------------------------
*/

export type ChapterDocument = HydratedDocument<IChapter>;
