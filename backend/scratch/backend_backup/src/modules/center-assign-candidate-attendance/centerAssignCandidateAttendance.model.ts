import { Schema, model } from "mongoose";

const CenterAssignCandidateAttendanceSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    allocatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Added based on user requirement to store attendance here
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
    },
    attendanceStatus: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CenterAssignCandidateAttendance = model(
  "CenterAssignCandidateAttendance",
  CenterAssignCandidateAttendanceSchema,
  "centerassigncandidateattendence" // Matching user requested spelling
);

export default CenterAssignCandidateAttendance;
