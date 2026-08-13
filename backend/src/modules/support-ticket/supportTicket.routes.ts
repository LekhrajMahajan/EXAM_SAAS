import { Router } from "express";
import { SupportTicketController } from "./supportTicket.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";
import { UserRole } from "../../constants/roles";
import { 
  createTicketSchema, 
  updateTicketStatusSchema, 
  assignTicketSchema, 
  addMessageSchema, 
  getTicketsFilterSchema 
} from "./supportTicket.validation";

const router = Router();
const controller = new SupportTicketController();

// All routes require authentication
router.use(authenticate);

// Statistics
router.get(
  "/statistics",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  controller.getStatistics
);

// Get All
router.get(
  "/",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(getTicketsFilterSchema),
  controller.getTickets
);

// Get By ID
router.get(
  "/:id",
  controller.getTicketById
);

// Create Ticket
router.post(
  "/",
  validateRequest(createTicketSchema),
  controller.createTicket
);

// Update Status
router.patch(
  "/:id/status",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(updateTicketStatusSchema),
  controller.updateStatus
);

// Assign Ticket
router.patch(
  "/:id/assign",
  authorize(UserRole.MASTER_ADMIN),
  validateRequest(assignTicketSchema),
  controller.assignTicket
);

// Add Message/Reply
router.post(
  "/:id/messages",
  validateRequest(addMessageSchema),
  controller.addMessage
);

// Delete Ticket
router.delete(
  "/:id",
  authorize(UserRole.MASTER_ADMIN),
  controller.deleteTicket
);

export default router;
