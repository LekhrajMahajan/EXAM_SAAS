import { Schema, model } from "mongoose";

const CenterAssignExamStaffSchema = new Schema(
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
    examName: {
      type: String,
    },
    reportingTime: {
      type: Date,
    },
    assignments: [
      {
        role: {
          type: String,
          required: true,
        },
        staffId: {
          type: Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        staffName: {
          type: String,
        },
        staffEmail: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CenterAssignExamStaff = model(
  "CenterAssignExamStaff",
  CenterAssignExamStaffSchema,
  "centerassignexamstaff"
);

export default CenterAssignExamStaff;
