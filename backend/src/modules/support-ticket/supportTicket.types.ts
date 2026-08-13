import { Document } from "mongoose";
import { Types } from "mongoose";

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketCategory {
  TECHNICAL = "TECHNICAL",
  BILLING = "BILLING",
  ACCOUNT = "ACCOUNT",
  FEATURE_REQUEST = "FEATURE_REQUEST",
  OTHER = "OTHER",
}

export interface IAttachment {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string | Types.ObjectId;
}

export interface IMessage {
  _id?: Types.ObjectId;
  senderId: string | Types.ObjectId;
  senderName?: string;
  senderRole?: string;
  message: string;
  attachments?: IAttachment[];
  isInternalNote: boolean;
  createdAt?: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string; // Auto-generated e.g., TKT-1001
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  companyId?: string | Types.ObjectId; // null for generic system tickets
  creatorId: string | Types.ObjectId;
  assignedTo?: string | Types.ObjectId; // null if unassigned
  
  conversation: IMessage[];
  attachments: IAttachment[];
  
  // SLA
  slaDueDate?: Date;
  slaResolutionDate?: Date;
  isSlaBreached: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTicketData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  attachments?: Omit<IAttachment, "uploadedAt" | "uploadedBy">[];
  companyId?: string;
}

export interface IUpdateTicketStatus {
  status: TicketStatus;
}

export interface IAssignTicket {
  assigneeId: string;
}

export interface IAddMessage {
  message: string;
  isInternalNote: boolean;
  attachments?: Omit<IAttachment, "uploadedAt" | "uploadedBy">[];
}

export interface ITicketFilters {
  companyId?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  category?: TicketCategory;
  assignedTo?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
