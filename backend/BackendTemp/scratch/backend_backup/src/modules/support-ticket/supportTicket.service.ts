import { SupportTicketRepository } from "./supportTicket.repository";
import { 
  ISupportTicket, 
  ITicketFilters, 
  ICreateTicketData, 
  IUpdateTicketStatus, 
  IAssignTicket, 
  IAddMessage,
  TicketStatus,
  TicketPriority
} from "./supportTicket.types";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import notificationService from "../notification/notification.service";
import activityLogService from "../activity-log/activityLog.service";
import mongoose from "mongoose";
import { NotificationType, NotificationChannel } from "../notification/notification.types";
import { ActivityType } from "../activity-log/activityLog.types";

export class SupportTicketService {
  private repository: SupportTicketRepository;

  constructor() {
    this.repository = new SupportTicketRepository();
  }

  private async generateTicketId(): Promise<string> {
    const lastId = await this.repository.getLatestTicketId();
    if (!lastId) return "TKT-1001";
    
    const numPart = parseInt(lastId.replace("TKT-", ""), 10);
    return `TKT-${numPart + 1}`;
  }

  async createTicket(userId: string, data: ICreateTicketData): Promise<ISupportTicket> {
    const ticketId = await this.generateTicketId();
    
    // SLA Settings Mock (In real world, fetch from system settings)
    const slaDueDate = new Date();
    slaDueDate.setHours(slaDueDate.getHours() + (data.priority === TicketPriority.CRITICAL ? 4 : 24));

    const mappedAttachments = data.attachments ? data.attachments.map(a => ({ ...a, uploadedAt: new Date(), uploadedBy: new mongoose.Types.ObjectId(userId) })) : [];

    const ticket = await this.repository.create({
      ...data,
      attachments: mappedAttachments,
      ticketId,
      creatorId: userId,
      slaDueDate,
    });

    await activityLogService.createActivity(
      "SUPPORT",
      ActivityType.CREATE,
      "Created Ticket",
      `Created support ticket ${ticketId}`,
      userId
    );

    return ticket;
  }

  async getTickets(filters: ITicketFilters) {
    return await this.repository.findWithFilters(filters);
  }

  async getTicketById(id: string) {
    const ticket = await this.repository.findById(id);
    if (!ticket) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Ticket not found");
    return ticket;
  }

  async updateStatus(id: string, userId: string, data: IUpdateTicketStatus) {
    const ticket = await this.getTicketById(id);
    
    const updateData: Partial<ISupportTicket> = { status: data.status };
    if (data.status === TicketStatus.RESOLVED || data.status === TicketStatus.CLOSED) {
      updateData.slaResolutionDate = new Date();
    }

    const updated = await this.repository.update(id, updateData);

    await activityLogService.createActivity(
      "SUPPORT",
      ActivityType.UPDATE,
      "Updated Ticket Status",
      `Updated status of ticket ${ticket.ticketId} to ${data.status}`,
      userId
    );

    // Notify creator
    if (updated) {
       await notificationService.create({
         type: NotificationType.SYSTEM,
         channel: NotificationChannel.IN_APP,
         recipientId: new mongoose.Types.ObjectId(updated.creatorId.toString()),
         title: "Ticket Status Updated",
         message: `Your ticket ${updated.ticketId} is now ${data.status}.`,
       });
    }

    return updated;
  }

  async assignTicket(id: string, userId: string, data: IAssignTicket) {
    const ticket = await this.getTicketById(id);
    const updated = await this.repository.update(id, { assignedTo: data.assigneeId });

    await activityLogService.createActivity(
      "SUPPORT",
      ActivityType.UPDATE,
      "Assigned Ticket",
      `Assigned ticket ${ticket.ticketId} to user ${data.assigneeId}`,
      userId
    );

    // Notify assignee
    await notificationService.create({
      type: NotificationType.SYSTEM,
      channel: NotificationChannel.IN_APP,
      recipientId: new mongoose.Types.ObjectId(data.assigneeId),
      title: "Ticket Assigned",
      message: `You have been assigned to ticket ${ticket.ticketId}.`,
    });

    return updated;
  }

  async addMessage(id: string, userId: string, userName: string, data: IAddMessage) {
    const ticket = await this.getTicketById(id);
    
    const mappedAttachments = data.attachments ? data.attachments.map(a => ({ ...a, uploadedAt: new Date(), uploadedBy: new mongoose.Types.ObjectId(userId) })) : [];

    const messageObj = {
      senderId: userId,
      senderName: userName,
      message: data.message,
      isInternalNote: data.isInternalNote,
      attachments: mappedAttachments,
      createdAt: new Date(),
    };

    const updated = await this.repository.update(id, {
      $push: { conversation: messageObj }
    } as any);

    if (!data.isInternalNote && ticket.creatorId.toString() !== userId) {
      await notificationService.create({
        type: NotificationType.SYSTEM,
        channel: NotificationChannel.IN_APP,
        recipientId: new mongoose.Types.ObjectId(ticket.creatorId.toString()),
        title: "New Reply on Ticket",
        message: `There is a new reply on your ticket ${ticket.ticketId}.`,
      });
    }

    return updated;
  }

  async deleteTicket(id: string, userId: string) {
    const ticket = await this.getTicketById(id);
    await this.repository.delete(id);

    await activityLogService.createActivity(
      "SUPPORT",
      ActivityType.DELETE,
      "Deleted Ticket",
      `Deleted ticket ${ticket.ticketId}`,
      userId
    );

    return true;
  }

  async getStatistics() {
    const [open, inProgress, resolved, closed, highPriority, overdue] = await Promise.all([
      this.repository.count({ status: TicketStatus.OPEN }),
      this.repository.count({ status: TicketStatus.IN_PROGRESS }),
      this.repository.count({ status: TicketStatus.RESOLVED }),
      this.repository.count({ status: TicketStatus.CLOSED }),
      this.repository.count({ priority: TicketPriority.HIGH }),
      this.repository.count({ status: { $ne: TicketStatus.RESOLVED }, slaDueDate: { $lt: new Date() } }),
    ]);

    return {
      open,
      inProgress,
      resolved,
      closed,
      highPriority,
      overdue,
      avgResolutionTime: "2.4h" // Mocked metric
    };
  }
}
