import { Document, Types } from "mongoose";

export enum EventSeverity {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
  INFORMATIONAL = "Informational",
}

export enum EventStatus {
  OPEN = "Open",
  INVESTIGATING = "Investigating",
  RESOLVED = "Resolved",
  DISMISSED = "Dismissed",
}

export interface ISecurityEvent extends Document {
  eventId: string;
  eventType: string; // e.g., 'Failed Login', 'JWT Validation Failure'
  category: string; // e.g., 'Authentication', 'Authorization', 'Anomaly'
  severity: EventSeverity;
  
  // User & Context
  userId?: Types.ObjectId;
  employeeId?: string;
  companyId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  
  // Request & Device Info
  ipAddress?: string;
  device?: string;
  browser?: string;
  operatingSystem?: string;
  location?: string;
  
  // Status & Assignment
  status: EventStatus;
  assignedTo?: Types.ObjectId; // User/Employee ID handling it
  
  // Details
  metadata?: Record<string, any>; // Raw payload or details
  recommendedAction?: string;
  relatedEvents?: Types.ObjectId[]; // Correlated event IDs
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
