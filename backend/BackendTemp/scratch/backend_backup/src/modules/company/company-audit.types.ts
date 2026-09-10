import { HydratedDocument, Types } from "mongoose";

export interface ICompanyAuditLog {
  companyId: Types.ObjectId;
  action: "SUBMITTED" | "REVIEW_STARTED" | "REVIEW_COMPLETED" | "APPROVED" | "REJECTED" | "DOCUMENT_VIEWED" | "REVIEWER_ASSIGNED";
  performedBy?: Types.ObjectId | null;
  isSystem?: boolean;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyAuditLogDocument = HydratedDocument<ICompanyAuditLog>;
