import mongoose, { Schema, Document } from 'mongoose';

export interface IImportCenterData {
  centerName: string;
  centerType: string;
  centerCode: string;
  examCenterCode?: string;
  examName: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  matchedCenterId?: mongoose.Types.ObjectId;
}

export interface IImportCenterAssignExam extends Document {
  examId: mongoose.Types.ObjectId;
  centers: IImportCenterData[];
  isSentToCompanyAdmin: boolean;
  isSentToCenters: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ImportCenterDataSchema = new Schema<IImportCenterData>({
  centerName: { type: String, required: true },
  centerType: { type: String, required: true },
  centerCode: { type: String, required: true },
  examCenterCode: { type: String, required: false },
  examName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true },
  matchedCenterId: { type: Schema.Types.ObjectId, ref: 'Center' },
});

const ImportCenterAssignExamSchema = new Schema<IImportCenterAssignExam>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    centers: { type: [ImportCenterDataSchema], required: true },
    isSentToCompanyAdmin: { type: Boolean, default: false },
    isSentToCenters: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ImportCenterAssignExamModel = mongoose.model<IImportCenterAssignExam>(
  'ImportCenterAssignExam',
  ImportCenterAssignExamSchema
);
