import SupportTicket from "./supportTicket.model";
import { ISupportTicket, ITicketFilters } from "./supportTicket.types";
import { Types } from "mongoose";

export class SupportTicketRepository {
  async create(data: Partial<ISupportTicket>): Promise<ISupportTicket> {
    const ticket = new SupportTicket(data);
    return await ticket.save();
  }

  async findById(id: string): Promise<ISupportTicket | null> {
    return await SupportTicket.findById(id)
      .populate("companyId", "name logo")
      .populate("creatorId", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("conversation.senderId", "firstName lastName");
  }

  async findWithFilters(filters: ITicketFilters): Promise<{ data: ISupportTicket[]; total: number }> {
    const query: any = {};

    if (filters.companyId) query.companyId = new Types.ObjectId(filters.companyId);
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.assignedTo) query.assignedTo = new Types.ObjectId(filters.assignedTo);
    
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { ticketId: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SupportTicket.find(query)
        .populate("companyId", "name")
        .populate("creatorId", "firstName lastName email")
        .populate("assignedTo", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SupportTicket.countDocuments(query),
    ]);

    return { data: data as unknown as ISupportTicket[], total };
  }

  async update(id: string, data: Partial<ISupportTicket>): Promise<ISupportTicket | null> {
    return await SupportTicket.findByIdAndUpdate(id, data, { new: true })
      .populate("companyId", "name")
      .populate("creatorId", "firstName lastName")
      .populate("assignedTo", "firstName lastName");
  }

  async delete(id: string): Promise<boolean> {
    const result = await SupportTicket.findByIdAndDelete(id);
    return !!result;
  }

  async count(query: any = {}): Promise<number> {
    return await SupportTicket.countDocuments(query);
  }

  async getLatestTicketId(): Promise<string | null> {
    const latestTicket = await SupportTicket.findOne().sort({ createdAt: -1 }).select("ticketId").lean();
    return latestTicket?.ticketId || null;
  }
}
