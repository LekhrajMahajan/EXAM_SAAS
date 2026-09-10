import mongoose, { Document, Schema } from 'mongoose';

export interface IImportCandidate extends Document {
  candidateId: string;
  applicationNo: string;
  rollNo?: string;
  centerName: string;
  centerId?: mongoose.Types.ObjectId;
  examId?: mongoose.Types.ObjectId;
  labId?: mongoose.Types.ObjectId;
  examName: string;
  candidateFullName: string;
  fatherName: string;
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
  aadharNumber: string;
  importedAt: Date;
  isSentToCenter: boolean;
  isLoginEnabled: boolean;
  isSentToCompanyAdmin: boolean;
  dynamicFields: Record<string, any>;
}

const ImportCandidateSchema = new Schema<IImportCandidate>(
  {
    candidateId: { type: String, required: true },
    applicationNo: { type: String, required: true },
    rollNo: { type: String },
    centerName: { type: String, required: true },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center' },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
    labId: { type: Schema.Types.ObjectId, ref: 'CenterLab' },
    examName: { type: String, required: true },
    candidateFullName: { type: String, required: true },
    fatherName: { type: String, required: true },
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
    aadharNumber: { type: String, required: true },
    importedAt: { type: Date, default: Date.now },
    isSentToCenter: { type: Boolean, default: false },
    isLoginEnabled: { type: Boolean, default: false },
    isSentToCompanyAdmin: { type: Boolean, default: false },
    dynamicFields: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    collection: 'importcandidate'
  }
);

export const ImportCandidate = mongoose.models.importcandidate || mongoose.model<IImportCandidate>('importcandidate', ImportCandidateSchema);
