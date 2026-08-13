import { Schema, model } from "mongoose";

export interface ICustomReport {
  reportName: string;
  description?: string;
  dataSource: string;
  fields: {
    name: string;
    label: string;
    hidden: boolean;
    order: number;
  }[];
  filters?: Record<string, any>;
  grouping?: string[];
  sorting?: {
    field: string;
    order: "asc" | "desc";
  }[];
  aggregations?: {
    field: string;
    type: "count" | "sum" | "avg" | "min" | "max" | "distinct" | "percentage";
  }[];
  calculatedFields?: {
    name: string;
    label: string;
    expression: string;
  }[];
  visibility: "PRIVATE" | "COMPANY" | "PUBLIC";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  generatedBy: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
  isFavorite: boolean;
}

const customReportSchema = new Schema(
  {
    reportName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dataSource: {
      type: String,
      required: true,
    },
    fields: [
      {
        name: { type: String, required: true },
        label: { type: String, required: true },
        hidden: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
    filters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    grouping: [
      {
        type: String,
      },
    ],
    sorting: [
      {
        field: { type: String, required: true },
        order: { type: String, enum: ["asc", "desc"], required: true },
      },
    ],
    aggregations: [
      {
        field: { type: String, required: true },
        type: {
          type: String,
          enum: ["count", "sum", "avg", "min", "max", "distinct", "percentage"],
          required: true,
        },
      },
    ],
    calculatedFields: [
      {
        name: { type: String, required: true },
        label: { type: String, required: true },
        expression: { type: String, required: true },
      },
    ],
    visibility: {
      type: String,
      enum: ["PRIVATE", "COMPANY", "PUBLIC"],
      default: "COMPANY",
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

customReportSchema.index({
  companyId: 1,
  status: 1,
});

customReportSchema.index({
  generatedBy: 1,
  createdAt: -1,
});

const CustomReport = model("CustomReport", customReportSchema);

export default CustomReport;
