import { Schema, model } from "mongoose";

/*
|--------------------------------------------------------------------------
| ExamSession Model
| Persists per-candidate exam session state across page refreshes.
| Stores sectional timings and part-wise order.
|--------------------------------------------------------------------------
*/

const SectionTimingSchema = new Schema(
  {
    subjectName: { type: String, required: true },
    startedAt: { type: Date, required: true },
    lockedAt: { type: Date, default: null },
    isLocked: { type: Boolean, default: false },
    timeAllottedMinutes: { type: Number, required: true },
  },
  { _id: false }
);

const ExamSessionSchema = new Schema(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    // Part-wise flow: ordered list of part names candidate chose
    partOrder: [{ type: String }],
    currentPartIndex: { type: Number, default: 0 },
    // Sectional timings
    sectionTimings: [SectionTimingSchema],
    startedAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: "examsessions",
  }
);

// Compound index to quickly look up a session
ExamSessionSchema.index({ examId: 1, candidateId: 1 }, { unique: true });

export const ExamSession = model("ExamSession", ExamSessionSchema);
