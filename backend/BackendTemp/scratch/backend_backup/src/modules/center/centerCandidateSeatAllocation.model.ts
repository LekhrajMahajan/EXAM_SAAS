import mongoose, { Document, Schema } from 'mongoose';

export interface ICenterCandidateSeatAllocation extends Document {
  examId: mongoose.Types.ObjectId;
  labId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  centerId: mongoose.Types.ObjectId;
  allocatedAt: Date;
}

const CenterCandidateSeatAllocationSchema = new Schema<ICenterCandidateSeatAllocation>({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  labId: { type: Schema.Types.ObjectId, ref: 'CenterLab', required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'importcandidate', required: true },
  centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
  allocatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'centercandidateseatallocation'
});

export const CenterCandidateSeatAllocation = mongoose.models.centercandidateseatallocation || mongoose.model<ICenterCandidateSeatAllocation>('centercandidateseatallocation', CenterCandidateSeatAllocationSchema);
