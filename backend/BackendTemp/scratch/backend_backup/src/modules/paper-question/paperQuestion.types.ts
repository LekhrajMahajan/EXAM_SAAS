import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Paper Question Status
|--------------------------------------------------------------------------
*/

export enum PaperQuestionStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",
}

/*
|--------------------------------------------------------------------------
| Paper Question
|--------------------------------------------------------------------------
*/

export interface IPaperQuestion {
  paperId: Types.ObjectId;

  questionId: Types.ObjectId;

  sectionCode: string;

  questionOrder: number;

  marks: number;

  negativeMarks: number;

  isCompulsory: boolean;

  displayOrder: number;

  status: PaperQuestionStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Paper Question Document
|--------------------------------------------------------------------------
*/

export type PaperQuestionDocument = HydratedDocument<IPaperQuestion>;
