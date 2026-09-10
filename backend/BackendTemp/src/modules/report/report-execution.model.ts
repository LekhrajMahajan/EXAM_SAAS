import mongoose, { Schema, Document } from "mongoose";

export interface IReportExecution extends Document {
  scheduleId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in milliseconds
  rowsGenerated?: number;
  exportFormat: string;
  fileUrl?: string;
  errorMessage?: string;
  generatedBy: string; // 'System' or 'User Name'
}

const reportExecutionSchema = new Schema<IReportExecution>(
  {
    scheduleId: { type: Schema.Types.ObjectId, ref: 'ScheduledReport', required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'ReportTemplate', required: true },
    status: { type: String, enum: ['Pending', 'Running', 'Completed', 'Failed'], default: 'Pending' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    duration: { type: Number },
    rowsGenerated: { type: Number },
    exportFormat: { type: String, required: true },
    fileUrl: { type: String },
    errorMessage: { type: String },
    generatedBy: { type: String, default: 'System' },
  },
  { timestamps: true }
);

export const ReportExecution = mongoose.model<IReportExecution>("ReportExecution", reportExecutionSchema);
