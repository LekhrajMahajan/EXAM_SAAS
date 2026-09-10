import { Schema, model } from "mongoose";

import {
  IAttendance,
  AttendanceStatus,
  VerificationStatus,
} from "./attendance.types";

const attendanceSchema = new Schema<IAttendance>(
  {
    /*
        |--------------------------------------------------------------------------
        | References
        |--------------------------------------------------------------------------
        */

    candidateAssignmentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    admitCardId: {
      type: Schema.Types.ObjectId,
      ref: "AdmitCard",
      required: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "ExamShift",
      required: false,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      required: true,
    },

    examRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ExamRoom",
      required: false,
    },

    seatAllocationId: {
      type: Schema.Types.ObjectId,
      ref: "SeatAllocation",
      required: true,
    },

    /*
        |--------------------------------------------------------------------------
        | Attendance
        |--------------------------------------------------------------------------
        */

    attendanceStatus: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PENDING,
    },

    /*
        |--------------------------------------------------------------------------
        | Verification
        |--------------------------------------------------------------------------
        */

    qrVerification: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },

    biometricVerification: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },

    faceVerification: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },

    manualVerification: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },

    /*
        |--------------------------------------------------------------------------
        | Time
        |--------------------------------------------------------------------------
        */

    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Device Information
        |--------------------------------------------------------------------------
        */

    deviceId: {
      type: String,
      trim: true,
      default: null,
    },

    scannerId: {
      type: String,
      trim: true,
      default: null,
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Geo Location
        |--------------------------------------------------------------------------
        */

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Remarks
        |--------------------------------------------------------------------------
        */

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    /*
        |--------------------------------------------------------------------------
        | Soft Delete
        |--------------------------------------------------------------------------
        */

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Unique Indexes
|--------------------------------------------------------------------------
*/

// One Attendance Per Assignment

attendanceSchema.index(
  {
    candidateAssignmentId: 1,
  },
  {
    unique: true,
  },
);

// One Attendance Per Admit Card

attendanceSchema.index(
  {
    admitCardId: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Search Indexes
|--------------------------------------------------------------------------
*/

attendanceSchema.index({
  candidateId: 1,
});

attendanceSchema.index({
  examId: 1,
});

attendanceSchema.index({
  shiftId: 1,
});

attendanceSchema.index({
  examCenterId: 1,
});

attendanceSchema.index({
  examRoomId: 1,
});

attendanceSchema.index({
  seatAllocationId: 1,
});

attendanceSchema.index({
  attendanceStatus: 1,
});

attendanceSchema.index({
  qrVerification: 1,
});

attendanceSchema.index({
  biometricVerification: 1,
});

attendanceSchema.index({
  faceVerification: 1,
});

/*
|--------------------------------------------------------------------------
| Live Dashboard
|--------------------------------------------------------------------------
*/

attendanceSchema.index({
  examId: 1,
  attendanceStatus: 1,
});

attendanceSchema.index({
  examCenterId: 1,
  attendanceStatus: 1,
});

attendanceSchema.index({
  examRoomId: 1,
  attendanceStatus: 1,
});

/*
|--------------------------------------------------------------------------
| Attendance Analytics
|--------------------------------------------------------------------------
*/

attendanceSchema.index({
  checkInTime: -1,
});

attendanceSchema.index({
  checkOutTime: -1,
});

attendanceSchema.index({
  verifiedAt: -1,
});

/*
|--------------------------------------------------------------------------
| Geo Search
|--------------------------------------------------------------------------
*/

attendanceSchema.index({
  latitude: 1,
  longitude: 1,
});

/*
|--------------------------------------------------------------------------
| Device Tracking
|--------------------------------------------------------------------------
*/

attendanceSchema.index({
  deviceId: 1,
});

attendanceSchema.index({
  scannerId: 1,
});

attendanceSchema.index({
  ipAddress: 1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

attendanceSchema.index({
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export const AttendanceModel = model<IAttendance>(
  "Attendance",
  attendanceSchema,
);
