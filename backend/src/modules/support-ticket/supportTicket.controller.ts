import { Request, Response } from "express";
import { SupportTicketService } from "./supportTicket.service";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

export class SupportTicketController {
  private service: SupportTicketService;

  constructor() {
    this.service = new SupportTicketService();
  }

  createTicket = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const ticket = await this.service.createTicket(userId, req.body);
    sendResponse(res, HTTP_STATUS.CREATED, { success: true, message: "Ticket created successfully", data: ticket });
  };

  getTickets = async (req: Request, res: Response) => {
    const filters = req.query as any;
    const result = await this.service.getTickets(filters);
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Tickets retrieved successfully", data: result });
  };

  getTicketById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const ticket = await this.service.getTicketById(id);
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Ticket retrieved successfully", data: ticket });
  };

  updateStatus = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const ticket = await this.service.updateStatus(id, userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Ticket status updated successfully", data: ticket });
  };

  assignTicket = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const ticket = await this.service.assignTicket(id, userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Ticket assigned successfully", data: ticket });
  };

  addMessage = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const userName = (req.user as any).firstName ? `${(req.user as any).firstName} ${(req.user as any).lastName}` : 'User';
    const ticket = await this.service.addMessage(id, userId, userName, req.body);
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Message added successfully", data: ticket });
  };

  deleteTicket = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    await this.service.deleteTicket(id, userId);
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Ticket deleted successfully" });
  };

  getStatistics = async (req: Request, res: Response) => {
    const stats = await this.service.getStatistics();
    sendResponse(res, HTTP_STATUS.OK, { success: true, message: "Statistics retrieved successfully", data: stats });
  };
}
