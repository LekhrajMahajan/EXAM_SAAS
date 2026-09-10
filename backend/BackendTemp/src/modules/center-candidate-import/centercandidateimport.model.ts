import mongoose, { Document, Schema } from 'mongoose';

export interface ICenterCandidateImport extends Document {
  candidateId: string;
  applicationNo: string;
  rollNo?: string;
  centerName: string;
  examId?: mongoose.Types.ObjectId;
  examName: string;
  candidateFullName: string;
  fatherName?: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  category?: string;
  candidatePhoto?: string;
  candidateSignature?: string;
  pwdStatus?: string;
  pwdType?: string;
  organization?: string;
  examCode?: string;
  notificationNo?: string;
  postName?: string;
  paperSubject?: string;
  examStage?: string;
  examDate?: string;
  shift?: string;
  reportingTime?: string;
  gateClosingTime?: string;
  examStartTime?: string;
  duration?: string;
  examMode?: string;
  centreCode?: string;
  fullCentreAddress?: string;
  city?: string;
  district?: string;
  state?: string;
  pin?: string;
  landmark?: string;
  nearestRailwayStation?: string;
  language?: string;
  scribeDetails?: string;
  physicalTestDetails?: string;
  photoIdInstructions?: string;
  importantInstructions?: string;
  candidateDeclaration?: string;
  biometricInfo?: string;
  importedAt: Date;
}

const CenterCandidateImportSchema = new Schema<ICenterCandidateImport>(
  {
    candidateId: { type: String, required: true },
    applicationNo: { type: String, required: true },
    rollNo: { type: String },
    centerName: { type: String, required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
    examName: { type: String, required: true },
    candidateFullName: { type: String, required: true },
    fatherName: { type: String },
    motherName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    category: { type: String },
    candidatePhoto: { type: String },
    candidateSignature: { type: String },
    pwdStatus: { type: String },
    pwdType: { type: String },
    organization: { type: String },
    examCode: { type: String },
    notificationNo: { type: String },
    postName: { type: String },
    paperSubject: { type: String },
    examStage: { type: String },
    examDate: { type: String },
    shift: { type: String },
    reportingTime: { type: String },
    gateClosingTime: { type: String },
    examStartTime: { type: String },
    duration: { type: String },
    examMode: { type: String },
    centreCode: { type: String },
    fullCentreAddress: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pin: { type: String },
    landmark: { type: String },
    nearestRailwayStation: { type: String },
    language: { type: String },
    scribeDetails: { type: String },
    physicalTestDetails: { type: String },
    photoIdInstructions: { type: String },
    importantInstructions: { type: String },
    candidateDeclaration: { type: String },
    biometricInfo: { type: String },
    importedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const CenterCandidateImport = mongoose.model<ICenterCandidateImport>('centercadidateimport', CenterCandidateImportSchema);
