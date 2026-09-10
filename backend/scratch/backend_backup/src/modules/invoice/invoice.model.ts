import { Schema, model } from "mongoose";
import { IInvoice, InvoiceStatus, PaymentStatus, InvoiceType } from "./invoice.types";

const invoiceItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
    paymentReferenceId: { type: String },
    type: {
      type: String,
      enum: Object.values(InvoiceType),
      default: InvoiceType.INVOICE,
      required: true,
    },
    referenceInvoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
    
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    
    items: { type: [invoiceItemSchema], required: true },
    
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.DRAFT,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    
    generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for common queries
invoiceSchema.index({ status: 1, issueDate: -1 });
invoiceSchema.index({ companyId: 1, status: 1 });

export default model<IInvoice>("Invoice", invoiceSchema);
