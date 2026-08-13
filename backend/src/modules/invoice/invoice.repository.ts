import Invoice from "./invoice.model";
import { IInvoice, InvoiceType, InvoiceStatus } from "./invoice.types";
import { Types, PipelineStage } from "mongoose";
import Company from "../company/company.model";

class InvoiceRepository {
  async findCompaniesByName(name: string) {
    return Company.find({ companyName: { $regex: name, $options: "i" } }).select("_id").lean();
  }
  async create(data: Partial<IInvoice>): Promise<IInvoice> {
    const invoice = new Invoice(data);
    return invoice.save();
  }

  async findById(id: string): Promise<IInvoice | null> {
    return Invoice.findById(id)
      .populate("companyId", "companyName companyCode email phone address city state country pincode gstNumber")
      .populate({
        path: "subscriptionId",
        select: "planId status billingCycle startDate endDate",
        populate: { path: "planId", select: "planName" }
      })
      .lean();
  }

  async update(id: string, updateData: Partial<IInvoice>): Promise<IInvoice | null> {
    return Invoice.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  async find(filter: Record<string, any>, skip = 0, limit = 10, sort = { createdAt: -1 }): Promise<IInvoice[]> {
    return Invoice.find({ ...filter, isDeleted: false })
      .populate("companyId", "companyName companyCode")
      .populate({
        path: "subscriptionId",
        select: "planId status",
        populate: { path: "planId", select: "name" }
      })
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countDocuments(filter: Record<string, any>): Promise<number> {
    return Invoice.countDocuments({ ...filter, isDeleted: false });
  }

  async getNextInvoiceNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const prefix = `INV-${year}-`;
    
    const lastInvoice = await Invoice.findOne({ invoiceNumber: { $regex: `^${prefix}` } })
      .sort({ invoiceNumber: -1 })
      .select("invoiceNumber")
      .lean();
      
    if (!lastInvoice) {
      return `${prefix}00001`;
    }
    
    const lastNum = parseInt(lastInvoice.invoiceNumber.split("-")[2], 10);
    return `${prefix}${(lastNum + 1).toString().padStart(5, "0")}`;
  }

  async getDashboardStats(filter: Record<string, any> = {}) {
    const matchStage: Record<string, any> = { isDeleted: false, ...filter };
    
    // Handle date fields if passed as strings
    if (matchStage.issueDate && typeof matchStage.issueDate === 'object') {
      if (matchStage.issueDate.$gte) matchStage.issueDate.$gte = new Date(matchStage.issueDate.$gte);
      if (matchStage.issueDate.$lte) matchStage.issueDate.$lte = new Date(matchStage.issueDate.$lte);
    }
    if (matchStage.companyId) matchStage.companyId = new Types.ObjectId(matchStage.companyId as string);

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: { $cond: [{ $eq: ["$type", InvoiceType.INVOICE] }, 1, 0] } },
          paidInvoices: { $sum: { $cond: [{ $and: [{ $eq: ["$status", InvoiceStatus.PAID] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, 1, 0] } },
          pendingInvoices: { $sum: { $cond: [{ $and: [{ $eq: ["$status", InvoiceStatus.UNPAID] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, 1, 0] } },
          overdueInvoices: { $sum: { $cond: [{ $and: [{ $eq: ["$status", InvoiceStatus.OVERDUE] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, 1, 0] } },
          cancelledInvoices: { $sum: { $cond: [{ $and: [{ $eq: ["$status", InvoiceStatus.CANCELLED] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, 1, 0] } },
          creditNotes: { $sum: { $cond: [{ $eq: ["$type", InvoiceType.CREDIT_NOTE] }, 1, 0] } },
          debitNotes: { $sum: { $cond: [{ $eq: ["$type", InvoiceType.DEBIT_NOTE] }, 1, 0] } },
          totalRevenue: { $sum: { $cond: [{ $and: [{ $eq: ["$status", InvoiceStatus.PAID] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, "$grandTotal", 0] } },
          pendingRevenue: { $sum: { $cond: [{ $and: [{ $in: ["$status", [InvoiceStatus.UNPAID, InvoiceStatus.OVERDUE]] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, "$grandTotal", 0] } },
          overdueRevenue: { $sum: { $cond: [{ $and: [{ $eq: ["$status", InvoiceStatus.OVERDUE] }, { $eq: ["$type", InvoiceType.INVOICE] }] }, "$grandTotal", 0] } },
        },
      },
    ];

    const todayStr = new Date().toISOString().split("T")[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const firstDayOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastDayOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59, 999);

    const [stats, todayStats, monthStats, prevMonthStats] = await Promise.all([
      Invoice.aggregate(pipeline),
      Invoice.aggregate([
        { 
          $match: { 
            ...matchStage,
            type: InvoiceType.INVOICE,
            status: InvoiceStatus.PAID,
            issueDate: { $gte: new Date(`${todayStr}T00:00:00.000Z`) } 
          } 
        },
        { $group: { _id: null, revenue: { $sum: "$grandTotal" } } }
      ]),
      Invoice.aggregate([
        { 
          $match: { 
            ...matchStage,
            type: InvoiceType.INVOICE,
            status: InvoiceStatus.PAID,
            issueDate: { $gte: firstDayOfMonth } 
          } 
        },
        { $group: { _id: null, revenue: { $sum: "$grandTotal" } } }
      ]),
      Invoice.aggregate([
        { 
          $match: { 
            ...matchStage,
            type: InvoiceType.INVOICE,
            status: InvoiceStatus.PAID,
            issueDate: { $gte: firstDayOfPrevMonth, $lte: lastDayOfPrevMonth } 
          } 
        },
        { $group: { _id: null, revenue: { $sum: "$grandTotal" } } }
      ]),
    ]);

    const baseStats = stats[0] || {
      totalInvoices: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      cancelledInvoices: 0,
      creditNotes: 0,
      debitNotes: 0,
      totalRevenue: 0,
      pendingRevenue: 0,
      overdueRevenue: 0,
    };

    const currentMonthRev = monthStats[0]?.revenue || 0;
    const prevMonthRev = prevMonthStats[0]?.revenue || 0;
    let monthlyGrowth = 0;
    if (prevMonthRev > 0) {
      monthlyGrowth = ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100;
    } else if (currentMonthRev > 0) {
      monthlyGrowth = 100;
    }

    return {
      ...baseStats,
      todayRevenue: todayStats[0]?.revenue || 0,
      monthlyRevenue: currentMonthRev,
      averageInvoiceValue: baseStats.paidInvoices > 0 ? baseStats.totalRevenue / baseStats.paidInvoices : 0,
      monthlyGrowth,
    };
  }

  async getDashboardCharts(filter: Record<string, any> = {}) {
    const matchStage: Record<string, any> = { isDeleted: false, ...filter };
    if (matchStage.issueDate && typeof matchStage.issueDate === 'object') {
      if (matchStage.issueDate.$gte) matchStage.issueDate.$gte = new Date(matchStage.issueDate.$gte);
      if (matchStage.issueDate.$lte) matchStage.issueDate.$lte = new Date(matchStage.issueDate.$lte);
    }
    if (matchStage.companyId) matchStage.companyId = new Types.ObjectId(matchStage.companyId as string);

    const [revenueTrend, statusDistribution, paymentDistribution, volumeByMonth] = await Promise.all([
      Invoice.aggregate([
        { $match: { ...matchStage, type: InvoiceType.INVOICE, status: InvoiceStatus.PAID } },
        {
          $group: {
            _id: {
              year: { $year: "$issueDate" },
              month: { $month: "$issueDate" },
            },
            revenue: { $sum: "$grandTotal" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Invoice.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      Invoice.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$paymentStatus",
            count: { $sum: 1 }
          }
        }
      ]),
      Invoice.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: "$issueDate" },
              month: { $month: "$issueDate" },
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ])
    ]);

    return { revenueTrend, statusDistribution, paymentDistribution, volumeByMonth };
  }

  async getTopCompaniesByRevenue(filter: Record<string, any> = {}) {
    const matchStage: Record<string, any> = { isDeleted: false, type: InvoiceType.INVOICE, status: InvoiceStatus.PAID, ...filter };
    if (matchStage.issueDate && typeof matchStage.issueDate === 'object') {
      if (matchStage.issueDate.$gte) matchStage.issueDate.$gte = new Date(matchStage.issueDate.$gte);
      if (matchStage.issueDate.$lte) matchStage.issueDate.$lte = new Date(matchStage.issueDate.$lte);
    }

    return Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$companyId",
          revenue: { $sum: "$grandTotal" },
          invoices: { $sum: 1 },
        }
      },
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          companyName: "$company.companyName",
          revenue: 1,
          invoices: 1
        }
      }
    ]);
  }
}

export const invoiceRepository = new InvoiceRepository();
