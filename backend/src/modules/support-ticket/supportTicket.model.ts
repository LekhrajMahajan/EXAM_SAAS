import { Schema, model } from "mongoose";
import { ISupportTicket, TicketPriority, TicketStatus, TicketCategory } from "./supportTicket.types";

const AttachmentSchema = new Schema(
  {
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String },
    senderRole: { type: String },
    message: { type: String, required: true },
    attachments: [AttachmentSchema],
    isInternalNote: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }
);

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    
    category: {
      type: String,
      enum: Object.values(TicketCategory),
      default: TicketCategory.OTHER,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.LOW,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
    },
    
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    
    conversation: [MessageSchema],
    attachments: [AttachmentSchema],
    
    slaDueDate: { type: Date },
    slaResolutionDate: { type: Date },
    isSlaBreached: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for common queries
SupportTicketSchema.index({ status: 1, companyId: 1 });
SupportTicketSchema.index({ priority: 1, status: 1 });
SupportTicketSchema.index({ createdAt: -1 });

export default model<ISupportTicket>("SupportTicket", SupportTicketSchema);
