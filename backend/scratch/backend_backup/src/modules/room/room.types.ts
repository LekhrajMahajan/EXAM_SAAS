import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Room Status
|--------------------------------------------------------------------------
*/

export enum RoomStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/*
|--------------------------------------------------------------------------
| Room Type
|--------------------------------------------------------------------------
*/

export enum RoomType {
  COMPUTER_LAB = "COMPUTER_LAB",

  CLASSROOM = "CLASSROOM",

  EXAM_HALL = "EXAM_HALL",

  SEMINAR_HALL = "SEMINAR_HALL",

  TRAINING_ROOM = "TRAINING_ROOM",

  OTHER = "OTHER",
}

/*
|--------------------------------------------------------------------------
| Room Interface
|--------------------------------------------------------------------------
*/

export interface IRoom {
  companyId: Types.ObjectId;
  centerId: Types.ObjectId;

  roomCode: string;

  roomName: string;

  roomType: RoomType;

  building: string;

  floor: number;

  capacity: number;

  availableSeats: number;

  rows: number;

  columns: number;

  cameraAvailable: boolean;

  biometricDevice: boolean;

  status: RoomStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Room Document
|--------------------------------------------------------------------------
*/

export type RoomDocument = HydratedDocument<IRoom>;
