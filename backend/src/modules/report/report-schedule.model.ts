import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledReport extends Document {
  name: string;
  templateId: mongoose.Types.ObjectId;
  frequency: 'One Time' | 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom Cron Expression';
  cronExpression?: string;
  dateRange: { start?: Date; end?: Date; relative?: string };
  timezone: string;
  executionTime?: string;
  recipients: { email: string; name?: string }[];
  deliveryChannels: string[]; // Email, System Notification, etc.
  status: 'Active' | 'Paused' | 'Disabled';
  retentionPeriod?: number; // Days to keep execution history
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const scheduledReportSchema = new Schema<IScheduledReport>(
  {
    name: { type: String, required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'ReportTemplate', required: true },
    frequency: { 
      type: String, 
      enum: ['One Time', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom Cron Expression'],
      required: true 
    },
    cronExpression: { type: String },
    dateRange: {
      start: { type: Date },
      end: { type: Date },
      relative: { type: String } // e.g., 'Last 30 Days'
    },
    timezone: { type: String, default: 'UTC' },
    executionTime: { type: String },
    recipients: [
      {
        email: { type: String, required: true },
        name: { type: String }
      }
    ],
    deliveryChannels: [{ type: String }],
    status: { type: String, enum: ['Active', 'Paused', 'Disabled'], default: 'Active' },
    retentionPeriod: { type: Number, default: 30 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ScheduledReport = mongoose.model<IScheduledReport>("ScheduledReport", scheduledReportSchema);
