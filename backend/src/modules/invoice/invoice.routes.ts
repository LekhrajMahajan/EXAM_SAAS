import { Router } from "express";
import { authorize } from "../../middleware/authorize";
import { authenticate } from "../../middleware/authenticate";
import { UserRole } from "../../constants/roles";
import { validate } from "../../middleware/validate";
import { queryInvoiceSchema, updateInvoiceStatusSchema, createNoteSchema, emailInvoiceSchema } from "./invoice.validation";
import {
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  generateCreditNote,
  generateDebitNote,
  getDashboardStats,
  getDashboardCharts,
  getTopCompaniesByRevenue,
  downloadInvoicePdf,
  resendInvoiceEmail,
  getCreditNotesByInvoiceId,
  getDebitNotesByInvoiceId,
} from "./invoice.controller";

const router = Router();

// Invoices are accessible by Master Admin and Company Admin (with different scoping usually handled in service)
// For this module, we are implementing Master Admin flows.
router.use(authenticate);
router.use(authorize(UserRole.MASTER_ADMIN));

router.get("/dashboard-stats", getDashboardStats);
router.get("/dashboard/charts", getDashboardCharts);
router.get("/dashboard/top-companies", getTopCompaniesByRevenue);

router.get("/", validate(queryInvoiceSchema), getAllInvoices);
router.get("/:id", getInvoiceById);
router.get("/:id/credit-notes", getCreditNotesByInvoiceId);
router.get("/:id/debit-notes", getDebitNotesByInvoiceId);

router.patch("/:id/status", validate(updateInvoiceStatusSchema), updateInvoiceStatus);

router.post("/:id/credit-note", validate(createNoteSchema), generateCreditNote);
router.post("/:id/debit-note", validate(createNoteSchema), generateDebitNote);

router.get("/:id/download", downloadInvoicePdf);
router.post("/:id/resend", validate(emailInvoiceSchema), resendInvoiceEmail);

export default router;
