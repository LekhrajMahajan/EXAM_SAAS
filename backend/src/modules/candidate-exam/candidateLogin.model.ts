import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidateLogin extends Document {
  candidateId: mongoose.Types.ObjectId;
  applicationNo: string;
  examId?: mongoose.Types.ObjectId;
  token: string;
  ipAddress?: string;
  deviceInfo?: string;
  loginAt: Date;
  logoutAt?: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'LOGGED_OUT';
}

const CandidateLoginSchema = new Schema<ICandidateLogin>(
  {
    candidateId: { type: Schema.Types.ObjectId, required: true },
    applicationNo: { type: String, required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
    token: { type: String, required: true },
    ipAddress: { type: String },
    deviceInfo: { type: String },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'LOGGED_OUT'], default: 'ACTIVE' },
  },
  {
    timestamps: true,
    collection: 'candidatelogin'
  }
);

export const CandidateLogin = mongoose.models.candidatelogin || mongoose.model<ICandidateLogin>('candidatelogin', CandidateLoginSchema);
