import { HydratedDocument, Types } from "mongoose";

export interface IComplianceFramework {
  name: string;
  enabled: boolean;
  score: number;
}

export interface ICompliancePolicy {
  companyId?: Types.ObjectId;
  frameworks: IComplianceFramework[];
  retentionDays: number;
  autoCleanup: boolean;
  legalHold: boolean;
  exportBeforeDeletion: boolean;
  createdAt: Date;
  updatedAt: Date;
}
