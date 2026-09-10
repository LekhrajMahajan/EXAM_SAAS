import mongoose, { Schema, Document } from "mongoose";

export interface IReportTemplate extends Document {
  name: string;
  description?: string;
  dataSource: string; // e.g., 'candidates', 'exams', 'financial'
  selectedFields: { name: string; label: string; hidden?: boolean; order?: number }[];
  filters: Record<string, any>;
  sorting: { field: string; direction: 'asc' | 'desc' }[];
  grouping: string[];
  aggregations: { field: string; type: 'sum' | 'avg' | 'count' | 'min' | 'max' }[];
  exportFormat: 'CSV' | 'PDF' | 'EXCEL' | 'Multiple';
  isPublished: boolean;
  branding?: {
    logo?: string;
    header?: string;
    footer?: string;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportTemplateSchema = new Schema<IReportTemplate>(
  {
    name: { type: String, required: true },
    description: { type: String },
    dataSource: { type: String, required: true },
    selectedFields: [
      {
        name: { type: String, required: true },
        label: { type: String, required: true },
        hidden: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      }
    ],
    filters: { type: Schema.Types.Mixed, default: {} },
    sorting: [
      {
        field: { type: String, required: true },
        direction: { type: String, enum: ['asc', 'desc'], required: true },
      }
    ],
    grouping: [{ type: String }],
    aggregations: [
      {
        field: { type: String, required: true },
        type: { type: String, enum: ['sum', 'avg', 'count', 'min', 'max'], required: true },
      }
    ],
    exportFormat: {
      type: String,
      enum: ['CSV', 'PDF', 'EXCEL', 'Multiple'],
      default: 'Multiple'
    },
    isPublished: { type: Boolean, default: false },
    branding: {
      logo: { type: String },
      header: { type: String },
      footer: { type: String },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ReportTemplate = mongoose.model<IReportTemplate>("ReportTemplate", reportTemplateSchema);
